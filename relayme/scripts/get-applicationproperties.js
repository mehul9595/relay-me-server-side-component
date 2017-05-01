var request = require('supertest');
var config = require('../config.js')();
var testconfig = require('./testconfig.js')();
var fs = require('fs');

var baseUrl = config.application.BASE_URL;
getApplicationProperties = function(done) {
    var userDetails = require(testconfig.REGISTRATION_DATA_JSON);
    console.log('User details loaded from %s: %s', testconfig.REGISTRATION_DATA_JSON, JSON.stringify(userDetails));
    var authToken = userDetails[testconfig.PROPERTY_AUTH_TOKEN];
    request(baseUrl).get('/relayme/server/api/applicationproperties').set('Authorization', 'Basic ' + authToken).end(
            function(err, res) {
                if (res.status != 200) {
                    throw ('Couldn\'t get application properties, got %s', res.status);
                }
                if (err) {
                    throw err;
                }
                done(res.body);
            });
};

getApplicationProperties(function(body) {
    console.log('Application properties: %s', JSON.stringify(body));
});
