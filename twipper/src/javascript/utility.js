/*
 * com/javascript/utility.js
 *
 * This is the base namespace
 */
var com;

if (!com) {
    com = {};
} else if (typeof com != 'object') {
    throw new Error('com already exists and is not an object');
}

if (!com.twipper) {
    com.twipper = {};
} else if (typeof com.twipper != 'object') {
    throw new Error('com.twipper already exists and is not an object');
}

if (!com.twipper.base) {
    com.twipper.base = {};
} else if (typeof com.twipper.base != 'object') {
    throw new Error('com already exists and is not an object');
}

if (!com || !com.twipper || !com.twipper.base) {
    throw new Error('utility.js has not been loaded');
}

// Tasks

com.twipper.base.Tasks = {};

com.twipper.base.task = function(definition) { // task object
    /*
     * Defines a task object
     */
    var that = {};
    
    definition = definition || {};
    
    if (!definition.widgets) {
        definition.widgets = {};
    }
    
    if (!definition.func) {
        definition.func = function() {
            debugString('THIS IS A FUNCTION ATTACHED TO A TASK');
        };
    }
    
    that.get_name = function() {
        return definition.name;
    };
    
    that.set_name = function(name) {
        definition.name = name;
    };
    
    that.execute = function() {
        definition.func(arguments);
    };
    
    that.add_widget = function(widget) { // widget will be a 'specialized' attribute/model object with an id property for naming
        //debugObject(widget);
        definition.widgets[widget.get_id()] = widget;
    };
    
    that.get_widget = function(id) {
        //debugObject(definition.widgets[id]);
        return definition.widgets[id];
    };
    
    that.remove_widget = function(id) {
        delete(definition.widgets[id]);
    };
    
    return that;
}

// Timers - this section handles specialized setInterval and setTimeout timers

com.twipper.base.Timers = {
    'activeTimers': [],
    'defaultInterval': 5000 // 5 seconds for setInterval/setTimeout
};

com.twipper.base.timer = function(definition) { // timer object
    /*
     * Defines a timer object
     */
    var that = {};
    
    definition = definition || {};
    
    that.get_interval = function() {
        return (!definition.interval) ? com.twipper.base.Timers.defaultInterval : definition.interval;
    };
    
    that.set_interval = function(interval) {
        definition.interval = interval;
    };
    
    that.get_id = function() {
        return definition.id;
    };
    
    that.get_state = function() {
        return definition.state;
    };
    
    that.set_state = function(state) {
        definition.state = state;
    };
    
    that.set_func = function(func) {
        definition.func = func;
    };
    
    that.get_func = function() {
        return definition.func;
    };
    
    that.execute = function() {
        var idString = 'tid';
        if (!definition.func) {
            definition.func = function() {
                console.log('GENERIC TIMER RUNNING - THIS IS BAD');
            };
        }
        switch(definition.type) {
            case 'repeat': {
                definition.id = setInterval(definition.func.bind(this), this.get_interval());
                definition.state = 'executing';
                break;
            }
            case 'once': {
                definition.id = setTimeout(definition.func.bind(this), this.get_interval());
                definition.state = 'executing';                
                break;
            }
            case 'limited': {
                break;
            }
        }
        idString += definition.id;
        com.twipper.base.Timers.activeTimers[idString] = definition;
        //debugObject(com.twipper.base.Timers);
        //debugString('THIS LENGTH CHECK SHOULD BE 1: ' + com.twipper.base.Timers.activeTimers.length);
    };
    
    that.stop_timer = function() {
        var idString = 'tid';
        switch(definition.type) {
            case 'repeat': {
                clearInterval(definition.id);
                definition.state = 'stopped';                
                break;
            }
            case 'once': {
                clearTimeout(definition.id);
                definition.state = 'stopped';
                break;
            }
            case 'limited': {
                break;
            }
        }
        idString += definition.id;
        debugString('TRYING TO UPDATE TIMER STATE: ' + definition.state);
        com.twipper.base.Timers.activeTimers[idString] = definition;
    }
    return that;
};

// Widgets - this section handles specialized widget objects

com.twipper.base.Widgets = {};

com.twipper.base.widget = function(definition) { // widget object
    /*
     * Defines a widget object
     */
    var that = {};
    
    that.get_controller = function() {
        return definition.controller;
    };
    
    that.get_id = function() {
        return definition.id;
    };
    
    that.set_id = function(id) {
        definition.id = id;
    };
    
    that.get_attributes = function() {
        return definition.attributes;
    };
    
    that.set_attributes = function(attributes) {
        definition.attributes = attributes;
    };
    
    that.get_model = function() {
        return definition.model;
    };
    
    that.set_model = function(model) {
        definition.model = model;
    };
    
    that.get_func = function() {
        return definition.func;
    };
    
    that.set_func = function(func) {
        definition.func = func;
    };
    
    that.execute_old = function(spin) {
        definition.func(spin);
    };
    
    that.execute = function() {
        definition.func.apply(definition, arguments);
    }
    
    return that;
}