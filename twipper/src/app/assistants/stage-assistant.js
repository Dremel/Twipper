var Twipper = {}; // let's use a big namespace

var widget = com.twipper.base.widget;
var dbColumn = com.twipper.db.dbColumn;
var dbTable = com.twipper.db.dbTable;
var dbInstance = com.twipper.db.dbInstance;

// candidate section to move to separate .js

// set up db info

// twipper users table
var twipper_id = dbColumn({
    'name': 'twipper_id',
    'type': 'INTEGER',
    'constraints': ['PRIMARY KEY']
});

var twitter_username = dbColumn({
    'name': 'twitter_username',
    'type': 'TEXT'
});

var twitter_password = dbColumn({
    'name': 'twitter_password',
    'type': 'TEXT'
});

var twipper_users = dbTable({
    'name': 'twipper_users',
    'columns': [twipper_id, twitter_username, twitter_password]
});

// twip history table
var twip_id = dbColumn({
    'name': 'twip_id',
    'type': 'INTEGER',
    'constraints': ['PRIMARY KEY']
});

var twipper_id_ref = dbColumn({
    'name': 'twipper_id',
    'type': 'INTEGER'
});

var twip_base = dbColumn({
    'name': 'twip_base',
    'type': 'INTEGER'
});

var twip_percent = dbColumn({
    'name': 'twip_percent',
    'type': 'INTEGER'
});

var twip_calculation = dbColumn({
    'name': 'twip_calculation',
    'type': 'INTEGER'
});

var twip_total = dbColumn({
    'name': 'twip_total',
    'type': 'INTEGER'
});

var twip_time = dbColumn({
    'name': 'twip_time',
    'type': 'TEXT'
});

var twip_location = dbColumn({
    'name': 'twip_location',
    'type': 'TEXT'
});

var twip_message = dbColumn({
    'name': 'twip_message',
    'type': 'TEXT'
});

var twip_status = dbColumn({
    'name': 'twip_status',
    'type': 'TEXT'
});

var twip_history = dbTable({
    'name': 'twip_history',
    'columns': [twip_id, twipper_id_ref, twip_base, twip_percent, twip_calculation, twip_total, twip_time, twip_location, twip_message, twip_status]
});

Twipper.dbs = {
    'internal': dbInstance({
        'name': 'twipper',
        'version': '0.0.1',
        'displayName': 'Twipper DB'
    }),
    'external': dbInstance({
        'name': 'ext:twipper',
        'version': '0.0.1',
        'displayName': 'Twipper history DB'
    })
};

var setupDB = function() {
    Twipper.dbs.internal.add_table(twipper_users);
    Twipper.dbs.external.add_table(twip_history);
};

// end db setup

// cookies
Twipper.Bakery = {
    'twipperCookie': {
        'cookie': new Mojo.Model.Cookie('twipperCookie'),
        'dough': { // set default property values here
            'installed': false,
            'twipper_id': ''
        }
    },
    'bake': function(cookieName) {
        Twipper.Bakery[cookieName].cookie.put(Twipper.Bakery[cookieName].dough);
    },
    'loadCookies': function() {
        var cookieName, properties;
        for (cookieName in Twipper.Bakery) {
            if (typeof(Twipper.Bakery[cookieName]) === 'object' && Twipper.Bakery[cookieName].cookie) {
                properties = Twipper.Bakery[cookieName].cookie.get();
                Twipper.Bakery[cookieName].dough = properties;
            }
        }
    }
};

var firstRun = function() {
    return !(Twipper.Bakery.twipperCookie.cookie.get() ? Twipper.Bakery.twipperCookie.cookie.get().installed : false);
};

// end cookies

// end candidate section

function StageAssistant() {
    //debugObject(Twipper.Bakery.install.cookie.get());
    if (firstRun()) {
        debugString('NEED TO INITIALIZE');
        setupDB();
        Twipper.Bakery.twipperCookie.dough.installed = true;
        Twipper.Bakery.twipperCookie.dough.twipper_id = '';
        Twipper.Bakery.bake('twipperCookie');
    } else {
        debugString('NEED TO LOAD COOKIES');
        Twipper.Bakery.loadCookies();
        debugObject(Twipper.Bakery.twipperCookie.cookie.get());
    }
}

StageAssistant.prototype.setup = function() {
    Twipper.testData = {};
    Twipper.testData.twitter_username = '';
    Twipper.testData.twitter_password = '';

    this.controller.pushScene('main');
}
