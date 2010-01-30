function MainAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

MainAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
    this.twipSubmit = widget({
        'attributes': {
            'label': 'Submit Twip',
            'type': Mojo.Widget.activityButton
        },
        'model': {
            'disabled': false
        }
    });
    
    this.dollars = widget({
        'attributes': {
            'label': 'Bill $',
            'min': 0,
            'max': 500
        },
        'model': {
            'value': 0
        }
    });
    
    this.cents = widget({
        'attributes': {
            'label': '.',
            'min': 0,
            'max': 99
            
        },
        'model': {
            'value': 0
        }
    });
    
    this.twipPercent = widget({
        'attributes': {
            'label': 'Tip %',
            'min': 0,
            'max': 100
            
        },
        'model': {
            'value': 0
        }
    });
    
    this.handleTwipCalculate = this.calculateTwip.bindAsEventListener(this);
    this.handleTwipSubmit = this.submitTwip.bindAsEventListener(this);
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
    this.controller.setupWidget('dollars', this.dollars.get_attributes(), this.dollars.get_model());
    this.controller.setupWidget('cents', this.cents.get_attributes(), this.cents.get_model());
    this.controller.setupWidget('twipPercent', this.twipPercent.get_attributes(), this.twipPercent.get_model());
    this.controller.setupWidget('twipSubmit', this.twipSubmit.get_attributes(), this.twipSubmit.get_model());
	/* add event handlers to listen to events from widgets */
    
}

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
    Mojo.Event.listen(this.controller.get('dollars'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.listen(this.controller.get('cents'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.listen(this.controller.get('twipPercent'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.listen(this.controller.get('twipSubmit'), Mojo.Event.tap, this.handleTwipSubmit);
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
    Mojo.Event.stopListening(this.controller.get('dollars'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.stopListening(this.controller.get('cents'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.stopListening(this.controller.get('twipPercent'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.stopListening(this.controller.get('twipSubmit'), Mojo.Event.tap, this.handleTwipSubmit);
        
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

MainAssistant.prototype.calculateTwip = function(event) {
    var dollars, cents, billTotal, twipPercent;
    
    dollars = Math.round(this.dollars.get_model().value * 100);
    cents = this.cents.get_model().value;
    twipPercent = this.twipPercent.get_model().value;
    billTotal = dollars + cents;
    this.controller.get('twipAmount').update('Amount to tip: ' + (Math.round((billTotal * twipPercent / 100)) / 100).toFixed(2));
    this.controller.get('grandTotal').update('Grand total: ' + (Math.round(billTotal + (billTotal * twipPercent / 100)) / 100).toFixed(2));

}

MainAssistant.prototype.submitTwip = function(event) {
    //debugObject(event.target, 'noFuncs');
    debugString(event.target.id);
    debugString(event.currentTarget.id);
    this.controller.get(event.currentTarget.id).mojo.deactivate();
    debugString('SUBMISSION GOES HERE');
}
