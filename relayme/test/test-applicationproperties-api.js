var request = require('supertest');
var should = require('should');
var util = require('./testutil')();

describe('ApplicationProperties', function() {
    var modules = util.getModules();
    var baseUrl = modules.config.application.BASE_URL;

    var jack = {
        plainPassword : 'password',
        deviceType : 'Windows phone',
        devMode : true
    };

    beforeEach(function(done) {
        util.removeAllUsers(function() {
            util.registerUser(jack, function(response) {
                util.setAuthToken(jack, response);
                util.removeAllApplicationProperties(function() {
                    done();
                });
            });
        });
    });

    describe('applicationproperties get', function() {
        it('Should return 401 when there is no authorization', function(done) {
            request(baseUrl).get('/relayme/server/api/applicationproperties').expect(401, done);
        });

        it('Should return 200 when user is authorized', function(done) {
            request(baseUrl).get('/relayme/server/api/applicationproperties')
                    .set('authorization', 'Basic ' + jack.auth).expect(200, done);
        })
    });
});
