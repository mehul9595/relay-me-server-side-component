var request = require('supertest');
var config = require('../config.js')();
var testconfig = require('./testconfig.js')();
var fs = require('fs');
var _ = require('lodash');

var baseUrl = config.application.BASE_URL;
postUser = function(done) {
    var userDetails = require(testconfig.REGISTRATION_DATA_JSON);
    console.log('User details loaded from %s: %s', testconfig.REGISTRATION_DATA_JSON, JSON.stringify(userDetails));
    var authToken = userDetails[testconfig.PROPERTY_AUTH_TOKEN];
    var userUpdateData = {};
    var randomNumber = Math.floor(Math.random() * (10000 - 1000)) + 1000;
    userUpdateData.username = userUpdateData.username + "_" + randomNumber;
    console.log('Posting user: %s', JSON.stringify(userUpdateData));
    request(baseUrl).post('/relayme/server/api/user').set('Authorization', 'Basic ' + authToken).send(
            userUpdateData).end(function(err, res) {
        if (res.status != 200) {
            throw ('Couldn\'t post user, got %s', res.status);
        }
        if (err) {
            throw err;
        }
        _.extend(userDetails, userUpdateData);
        var authToken = new Buffer(userDetails.username + ':' + userDetails.password).toString('base64');
        userDetails[testconfig.PROPERTY_AUTH_TOKEN] = authToken;
        fs.writeFile(testconfig.REGISTRATION_DATA_FILE, JSON.stringify(userDetails), function(err) {
            if (err) {
                return console.log(err);
            }
            console.log("User details is updated!");
        });
        done(res.body);
    });
};

postUser(function(body) {
    console.log('User updated: %s', JSON.stringify(body));
});
