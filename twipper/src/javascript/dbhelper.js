/*
 * New style Db objects
*/

var com;

if (!com || !com.twipper || !com.twipper.base) {
    throw new Error('utility.js has not been loaded');
} else {
    com.twipper.db = {}
}

com.twipper.db.dbColumn = function(definition) {
    var that = {}, sql;
    
    definition = definition || {};
    
    that.get_name = function() {
        return definition.name;
    };
    
    that.get_type = function() {
        return definition.type;
    };
    
    that.get_constraints = function() {
        return definition.constraints;
    };
    
    that.get_buildSql = function() {
        sql = definition.name + ' ' + definition.type;
        if (definition.constraints) {
            sql += ' ' + definition.constraints.join(' ');
        }
        return sql;
    };
    
    return that;
};

com.twipper.db.dbTable = function(definition) {
    var that = {}, sql, i;
    
    definition = definition || {};
    
    if (!definition.columns) {
        try {
            throw ('No columns defined for table: ' + definition.name);;
        }
        catch(e) {
            debugError('catastrophic', e);
        }
    }
    
    that.get_name = function() {
        return definition.name;
    };
    
    that.get_columns = function() {
        return definition.columns;
    };
    
    that.get_createSql = function() {
        if (!definition.columns) {
            try {
                throw ('No columns defined for table: ' + definition.name);
            }
            catch(e) {
                debugError('catastrophic', e);
            }
            
        }
        var columnArray = [];
        sql = "CREATE TABLE IF NOT EXISTS '" + definition.name + "' (";
        for (i = 0; i < definition.columns.length; i += 1) {
            columnArray.push(definition.columns[i].get_buildSql());
        }
        sql += columnArray.join(',') + ")";
        return sql;
    };
    
    that.get_insertSql = function(record) { // record is in JSON format
        
        try {
            if (!definition.columns) {
                throw('no columns defined for table: ' + definition.name);
            }
            if (!record) {
                throw('no record to insert into table: ' + definition.name);
            }
        }
        catch(error) {
            debugError('catastrophic', error);
        }
        
        var sqlArray = [];
        var values = [];
        var inserts = [];
        var columns = []
        sql = "INSERT OR REPLACE INTO '" + definition.name + "'";
        for (i in record) {
            inserts.push('?');
            values.push(record[i]);
            columns.push(i.toString());
        }
        sql += " (" + columns.join(', ') + ")";
        sql +=  " VALUES (" + inserts.join(', ') + ")";
        sqlArray.push(sql);
        sqlArray.push(values);
        return sqlArray;
    };
    
    that.get_selectSql = function(limiters) { // limiter is array of WHERE clauses in JSON format
        sql = "SELECT * FROM '" + definition.name + "'";
        if (!limiters) {
            limiters = [];
        }
        if (limiters.length > 0) {
            sql += " WHERE "            
            for (i = 0; i < limiters.length; i += 1) {
                sql += limiters[i].column + limiters[i].operand + "'" + limiters[i].value + "'" + (limiters[i].connector ? " " + limiters[i].connector + " " : "");
            }
        }        
        return sql;
    };
    
    return that;
};

com.twipper.db.dbInstance = function(definition) {
    var that = {
//        'schema': [],
  //      'connection': openDatabase(definition.name, definition.version, definition.displayName)
    };
    
    var update_schema = function(table) {
        debugString('UPDATING db.schema OBJECT');
        definition.schema[table.get_name()] = {'name': table.get_name(), 'status': 'completed', 'table': table};
        //debugObject(definition.schema, 'noFuncs');
    };
    
    definition = definition || {
        'name': Mojo.appInfo.title.split(' ').join('-').toUpperCase() + '-' + Mojo.appInfo.version,
        'version': Mojo.appInfo.version,
        'displayName': Mojo.appInfo.title
    };
    
    definition.schema = {};
    definition.connection = openDatabase(definition.name, definition.version, definition.displayName);
    
    //that.connection = openDatabase(definition.name, definition.version, definition.displayName);
    //that.schema = [];
    
    that.get_name = function() {
        return definition.name;
    };
    
    that.get_version = function() {
        return definition.version;
    };
    
    that.get_displayName = function() {
        return definition.displayName;
    };
    
    that.get_connection = function() {
        return definition.connection;
    }
    
    that.add_table = function(table, onSuccess, args) {
        definition.connection.transaction(function(transaction) {
            definition.schema[table.get_name()] = {'name': table.get_name(), 'status': 'pending', 'table': table};
            //debugObject(that.get_schema(), 'noFuncs');
            transaction.executeSql(table.get_createSql(), [],
                                   function(transaction, results) {
                                    try {
                                        update_schema(table);
                                        if(onSuccess) { // experimental
                                            (args) ? onSuccess.apply(definition, args) : onSuccess();
                                        }
                                        definition.schema[table.get_name()] = {'name': table.get_name(), 'status': 'complete', 'table': table};
                                    }
                                    catch(e) {
                                        debugError('catastrophic', e);
                                    }
                                   }.bind(this),
                                   function(transaction, error) {
                                    debugError('catastrophic', 'UNABLE TO ADD TABLE: ' + error.message);
                                   }.bind(this));
        }.bind(this));
    };
    
    that.add_table2 = function(table, synchronizer, onSuccess, args) {
        definition.connection.transaction(function(transaction) {
            var success = function(transaction, results) {
                                    try {
                                        update_schema(table);
                                        if(onSuccess) { // experimental
                                            (args) ? onSuccess.apply(definition, args) : onSuccess();
                                        }
                                        definition.schema[table.get_name()] = {'name': table.get_name(), 'status': 'complete', 'table': table};
                                    }
                                    catch(e) {
                                        debugError('catastrophic', e);
                                    }
                                   }.bind(this);
            definition.schema[table.get_name()] = {'name': table.get_name(), 'status': 'pending', 'table': table};
            //debugObject(that.get_schema(), 'noFuncs');
            transaction.executeSql(table.get_createSql(), [], synchronizer ? 
                                   synchronizer.wrap(success) : success,
                                   function(transaction, error) {
                                    debugError('catastrophic', 'UNABLE TO ADD TABLE: ' + error.message);
                                   }.bind(this));
        }.bind(this));
    };
    
    that.insert_record = function(table, record) {
        var sqlArray = table.get_insertSql(record);
        definition.connection.transaction(function(transaction) {
            transaction.executeSql(sqlArray[0], sqlArray[1],
                                   function(transaction, results) {
                                   }.bind(this),
                                   function(transaction, error) {
                                   }.bind(this));
        }.bind(this))
    };
    
    that.get_all_records = function(table, storageObject, synchronizer) {
        var resultSet = [];
        definition.connection.transaction(function(transaction) {
            var success = function(transaction, results) {
                                    try {
                                        var i;
                                        debugString('GOT ALL RECORDS FROM TABLE: ' + table.get_name());
                                        //debugObject(results.rows);
                                        for(i = 0; i < results.rows.length; i += 1) {
                                            //debugObject(results.rows.item(i));
                                            //return results.rows.item;
                                        }
                                    }
                                    catch(e) {
                                        debugError('catastrophic', e);
                                    }
                                   }.bind(this);            
            transaction.executeSql(table.get_selectSql(), [], synchronizer ? 
                                   synchronizer.wrap(success) : success,
                                   function(transaction, error) {
                                    debugError('severe', 'COULD NOT GET ALL RECORDS FROM TABLE (' + table.get_name() + '): ' + error.message);
                                   }.bind(this));
        });
    };
    
    that.get_schema = function() {
        return definition.schema;
    };

    return that;
};