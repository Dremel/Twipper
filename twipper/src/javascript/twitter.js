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

var twipTweet = function(username, password) {
    var url = 'https://twitter.com/statuses/update.json';
    var tweet = new Ajax.Request(url, {
        'method': 'post',
        'requestHeaders': {
            'Authorization': 'Basic ' + Base64.encode(Twipper.testData.twitter_username + ':' + Twipper.testData.twitter_password)
        },
        'evalJSON': true,
        'parameters': {
            'status': 'Test of the API'
        },
        'onSuccess': function(response) {
            debugString('CHECK FOR SUCCESSFUL TWEET!');
        }.bind(this),
        'onFailure': function(response) {
            debugObject(response.responseJSON);
            debugError('catastrophic', 'COULD NOT TWEET');
        }.bind(this)
    });
};