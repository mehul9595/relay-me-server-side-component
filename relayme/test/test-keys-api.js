var request = require('supertest');
var should = require('should');
var util = require('./testutil')();

describe('Keys', function() {
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
                done();
            });
        });
    });

    describe('Get keys', function() {
        it('Should return 200 when keys are requested with correct credentials', function(done) {
            var expectedKeys = {
                google : {
                    key : modules.config.google.CLIENT_ID,
                    secret : modules.config.google.CLIENT_SECRET,
                    callback : modules.config.google.CALLBACK_URL
                }
            };

            request(baseUrl).get('/relayme/server/api/keys').set('authorization', 'Basic ' + jack.auth).end(
                    function(err, res) {
                        if (err) {
                            throw err;
                        }
                        // this is should.js syntax, very clear
                        res.status.should.equal(200);
                        var encryptedKeys = res.body;
                        var decryptedKeys = {
                            google : {
                                key : modules.security.decryptString(encryptedKeys.google.key, jack.username,
                                        modules.config.application.encryptionSalt),
                                secret : modules.security.decryptString(encryptedKeys.google.secret, jack.username,
                                        modules.config.application.encryptionSalt),
                                callback : encryptedKeys.google.callback
                            }
                        };
                        JSON.stringify(decryptedKeys).should.equal(JSON.stringify(expectedKeys));
                        done();
                    });
        })

    });
});
