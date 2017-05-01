var request = require('supertest');
var config = require('../config.js')();
var testconfig = require('./testconfig.js')();
var fs = require('fs');

var baseUrl = config.application.BASE_URL;
verifyUser = function(done) {
    var userDetails = require(testconfig.REGISTRATION_DATA_JSON);
    console.log('User details loaded from %s: %s', testconfig.DATA_FILE_REGISTRATION, JSON.stringify(userDetails));
    var authToken = userDetails[testconfig.PROPERTY_AUTH_TOKEN];
    request(baseUrl).get('/relayme/server/api/user').set('Authorization', 'Basic ' + authToken).end(function(err, res) {
        if (res.status != 200) {
            throw ('Couldn\'t verify the user, got %s', res.status);
        }
        if (err) {
            throw err;
        }
        done(res.body);
    });
};

verifyUser(function(body) {
    console.log('User is verified');
});
