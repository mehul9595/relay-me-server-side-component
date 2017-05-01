var request = require('supertest');
var config = require('../config.js')();
var modules = {
    config : config
};
var security = require('../core/security.js')(modules);
var testconfig = require('./testconfig.js')();
var fs = require('fs');

var baseUrl = config.application.BASE_URL;
getKeys = function(done) {
    var userDetails = require(testconfig.REGISTRATION_DATA_JSON);
    console.log('User details loaded from %s: %s', testconfig.REGISTRATION_DATA_JSON, JSON.stringify(userDetails));
    var authToken = userDetails[testconfig.PROPERTY_AUTH_TOKEN];
    request(baseUrl).get('/relayme/server/api/keys').set('Authorization', 'Basic ' + authToken).end(
            function(err, res) {
                if (res.status != 200) {
                    throw ('Couldn\'t get keys, got %s', res.status);
                }
                if (err) {
                    throw err;
                }
                var encryptedKeys = res.body;
                var decryptedKeys = {
                        google: {
                            key : security.decryptString(encryptedKeys.google.key, userDetails.username,
                                    config.application.encryptionSalt),
                            secret : security.decryptString(encryptedKeys.google.secret, userDetails.username,
                                    config.application.encryptionSalt),
                            callback : encryptedKeys.google.callback
                        }
                };
                done(decryptedKeys);
            });};

getKeys(function(body) {
    console.log('Keys: %s', JSON.stringify(body));
});
