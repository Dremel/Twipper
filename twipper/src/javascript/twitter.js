var checkAuthentication = function(username, password) {
    var url = 'https://twitter.com/account/verify_credentials.json';
    var authCheck = new Ajax.Request(url, {
        'method': 'get',
        'requestHeaders': {
            'Authorization': 'Basic ' + Base64.encode(Twipper.testData.twitter_username + ':' + Twipper.testData.twitter_password)
            //'Authorization': 'Basic ' + Twipper.testData.twitter_username + ':' + Twipper.testData.twitter_password
        },
        'evalJSON': true,
        'onSuccess': function(response) {
            debugString('SUCCESSFUL AUTH!');
            debugObject(response.responseJSON);
        }.bind(this),
        'onFailure': function(response) {
            debugObject(response.responseJSON);
            debugError('catastrophic', 'COULD NOT AUTH');
        }.bind(this)
    });
};

//checkAuthentication();

var twipTweet = function(username, password, status, activityButton) {
    var url = 'https://twitter.com/statuses/update.json';
    var tweet = new Ajax.Request(url, {
        'method': 'post',
        'requestHeaders': {
            'Authorization': 'Basic ' + Base64.encode(username + ':' + password)
        },
        'evalJSON': true,
        'parameters': {
            'status': status ? status : 'Twipper test message'
        },
        'onSuccess': function(response) {
            //debugObject(response.responseJSON);
            //debugString('CHECK FOR SUCCESSFUL TWEET!');
            if (activityButton) {
                activityButton.mojo.deactivate();
            }
            // should check quiet_login and write username/pw to db if true
            if (Twipper.Bakery.twipperCookie.dough.quiet_login) {
                Twipper.dbs.internal.insert_record(Twipper.dbs.internal.get_schema().twipper_users.table, {'twipper_id': Twipper.Bakery.twipperCookie.dough.twipper_id, 'twitter_username': Twipper.Bakery.twipperCookie.dough.twitter_username, 'twitter_password': Twipper.Bakery.twipperCookie.dough.twitter_password});
            }
            
        }.bind(this),
        'onFailure': function(response) {
            //debugObject(response.responseJSON);
            //debugError('catastrophic', 'COULD NOT TWEET');
            if (activityButton) {
                activityButton.mojo.deactivate();
            }
            // should try to show an error dialog and/or login form again
            
        }.bind(this)
    });
};