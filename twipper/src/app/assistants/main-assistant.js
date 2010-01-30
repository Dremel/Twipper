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
            'type': Mojo.Widget.activityButton
        },
        'model': {
            'label': 'Submit Twip',
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
            'max': 99,
            'padNumbers': true
            
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
    
    this.twitter_username = widget({
        'attributes': {
            'hintText': 'Twitter user name',
            'textCase': Mojo.Widget.steModeLowerCase,
            'multiline': false,
            'enterSubmits': false,
            'focus': true
        },
        'model': {
            'value': '',
            'disabled': false
        }
    });
    
    this.twitter_password = widget({
        'attributes': {
            'hintText': 'Twitter password'
        },
        'model': {
            'value': ''
        }
    });
    
    this.quiet_login = widget({
        'attributes': {
            
        },
        'model': {
            'value': false,
            'disabled': false
        }
    });
    
    this.handleTwipCalculate = this.calculateTwip.bindAsEventListener(this);
    this.handleTwipSubmit = this.submitTwip.bindAsEventListener(this);
    this.handleSaveLoginDetails = this.saveLoginDetails.bindAsEventListener(this);
		
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
    this.controller.setupWidget('dollars', this.dollars.get_attributes(), this.dollars.get_model());
    this.controller.setupWidget('cents', this.cents.get_attributes(), this.cents.get_model());
    this.controller.setupWidget('twipPercent', this.twipPercent.get_attributes(), this.twipPercent.get_model());
    this.controller.setupWidget('twipSubmit', this.twipSubmit.get_attributes(), this.twipSubmit.get_model());
    this.controller.setupWidget('twitterUsername', this.twitter_username.get_attributes(), this.twitter_username.get_model());
    this.controller.setupWidget('twitterPassword', this.twitter_password.get_attributes(), this.twitter_password.get_model());
    this.controller.setupWidget('saveLoginDetails', this.quiet_login.get_attributes(), this.quiet_login.get_model());
	/* add event handlers to listen to events from widgets */
    
}

MainAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
    Mojo.Event.listen(this.controller.get('dollars'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.listen(this.controller.get('cents'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.listen(this.controller.get('twipPercent'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.listen(this.controller.get('twipSubmit'), Mojo.Event.tap, this.handleTwipSubmit);
    Mojo.Event.listen(this.controller.get('twitterUsername'), Mojo.Event.propertyChange, this.handleSaveLoginDetails);
    Mojo.Event.listen(this.controller.get('twitterPassword'), Mojo.Event.propertyChange, this.handleSaveLoginDetails);
    Mojo.Event.listen(this.controller.get('saveLoginDetails'), Mojo.Event.propertyChange, this.handleSaveLoginDetails);
    
    //checkAuthentication(Twipper.testData.twitter_username, Twipper.testData.twitter_password);
    
    if (Twipper.Bakery.twipperCookie.dough.quiet_login || (Twipper.Bakery.twipperCookie.dough.twitter_username && Twipper.Bakery.twipperCookie.dough.twitter_password)) {
        this.controller.get('twipAs').removeClassName('hidden');
        this.controller.get('twipAs').update('Twipping as: ' + Twipper.Bakery.twipperCookie.dough.twitter_username);
    }
}


MainAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
    Mojo.Event.stopListening(this.controller.get('dollars'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.stopListening(this.controller.get('cents'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.stopListening(this.controller.get('twipPercent'), Mojo.Event.propertyChange, this.handleTwipCalculate);
    Mojo.Event.stopListening(this.controller.get('twipSubmit'), Mojo.Event.tap, this.handleTwipSubmit);
    Mojo.Event.stopListening(this.controller.get('twitterUsername'), Mojo.Event.propertyChange, this.handleSaveLoginDetails);
    Mojo.Event.stopListening(this.controller.get('twitterPassword'), Mojo.Event.propertyChange, this.handleSaveLoginDetails);
    Mojo.Event.stopListening(this.controller.get('saveLoginDetails'), Mojo.Event.propertyChange, this.handleSaveLoginDetails);
        
}

MainAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}

MainAssistant.prototype.calculateTwip = function(event) {
    var dollars, cents, billTotal, twipPercent;
    
    dollars = Math.round(this.dollars.get_model().value * 100); // convert to pennies
    cents = this.cents.get_model().value;
    twipPercent = this.twipPercent.get_model().value;
    billTotal = dollars + cents;
    this.controller.get('twipAmount').update('Amount to tip: ' + (Math.round((billTotal * twipPercent / 100)) / 100).toFixed(2));
    this.controller.get('grandTotal').update('Grand total: ' + (Math.round(billTotal + (billTotal * twipPercent / 100)) / 100).toFixed(2));

}

MainAssistant.prototype.submitTwip = function(event) {
    var dollars, cents, billTotal, twipPercent, spinnerButton, buttonModel, statusMessage;
    
    dollars = Math.round(this.dollars.get_model().value * 100); // convert to pennies
    cents = this.cents.get_model().value;
    twipPercent = this.twipPercent.get_model().value;
    billTotal = dollars + cents;
    spinnerButton = this.controller.get(event.currentTarget.id); // will be passing this to the tweet function
    statusMessage = 'I just tipped $';
    statusMessage += (Math.round((billTotal * twipPercent / 100)) / 100).toFixed(2) + ' for a $';
    statusMessage += (billTotal / 100).toFixed(2) + ' meal.';
    
    debugString('SUBMISSION GOES HERE: ' + statusMessage);
    if (Twipper.Bakery.twipperCookie.dough.quiet_login || (Twipper.Bakery.twipperCookie.dough.twitter_username && Twipper.Bakery.twipperCookie.dough.twitter_password)) {
        buttonModel = this.twipSubmit.get_model();
        buttonModel.label = 'Submit Twip';
        this.twipSubmit.set_model(buttonModel);
        this.controller.modelChanged(this.twipSubmit.get_model());
        twipTweet(Twipper.Bakery.twipperCookie.dough.twitter_username, Twipper.Bakery.twipperCookie.dough.twitter_password, statusMessage, spinnerButton);
        this.controller.get('loginDetails').addClassName('hidden');
    } else {
        // need to show a login dialog
        buttonModel = this.twipSubmit.get_model();
        buttonModel.label = 'Try Again';
        this.twipSubmit.set_model(buttonModel);
        this.controller.modelChanged(this.twipSubmit.get_model());
        spinnerButton.mojo.deactivate();
        
        this.controller.get('loginDetails').removeClassName('hidden');
    }
}

MainAssistant.prototype.saveLoginDetails = function(event) {
    Twipper.Bakery.twipperCookie.dough.twitter_username = this.twitter_username.get_model().value;
    Twipper.Bakery.twipperCookie.dough.twitter_password = this.twitter_password.get_model().value;
    Twipper.Bakery.twipperCookie.dough.quiet_login = this.quiet_login.get_model().value;

    if (Twipper.Bakery.twipperCookie.dough.quiet_login) {
        Twipper.Bakery.bake('twipperCookie');
        // will write this values to db after a successful login
    }
    
    debugObject(Twipper.Bakery.twipperCookie.dough);
}