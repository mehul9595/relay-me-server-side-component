var request = require('supertest');
var config = require('../config.js')();
var testconfig = require('./testconfig.js')();
var fs = require('fs');

var baseUrl = config.application.BASE_URL;
var testUser = {
    deviceType : "android",
    deviceSubType : "KitKat",
    deviceVersion : "4.4",
    plainPassword : "my_password",
    deviceId : "my_device_id",
    devMode : true
};

registerUser = function(user, done) {
    request(baseUrl).post('/relayme/server/api/register').send(user).end(function(err, res) {
        if (err) {
            throw err;
        }
        done(res.body);
    });
};

registerUser(
        testUser,
        function(body) {
            console.log('Running against %s', baseUrl);
            var authToken = new Buffer(body.username + ':' + testUser.plainPassword).toString('base64');
            console.log('User is registered. Token: ' + authToken);
            var dataToDave = {};
            dataToDave[testconfig.PROPERTY_USERNAME] = body.username;
            dataToDave[testconfig.PROPERTY_PASSWORD] = testUser.plainPassword;
            dataToDave[testconfig.PROPERTY_AUTH_TOKEN] = authToken;
            fs.writeFile(testconfig.REGISTRATION_DATA_FILE, JSON.stringify(dataToDave), function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log("User details is saved!");
            });
            console.log('Authorization URLs:');
            var oauthFileContents = '<!DOCTYPE html>\n<html lang="en">\n<head><meta charset="utf-8"><title>OAuth Links</title></head>\n<body>\n';
            // generate following Url where {2} is Basic base64(username:plainpassword)
            var link = baseUrl + '/relayme/server/auth/google/login?debug=true&authorization=basic ' + authToken;
            oauthFileContents += '<a href="' + link + '"><h2>Google</h2></a>\n';
            oauthFileContents += '</body>\n</html>\n';
            fs.writeFile(testconfig.OAUTH_DATA_FILE, oauthFileContents, function(err) {
                if (err) {
                    return console.log(err);
                }
                console.log('HTML file with OAuth links is saved in %s.', testconfig.OAUTH_DATA_FILE);
            });
        });
