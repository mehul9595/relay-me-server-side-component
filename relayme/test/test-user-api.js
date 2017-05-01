var request = require('supertest');
var should = require('should');
var util = require('./testutil')();

describe('User', function() {
    var modules = util.getModules();
    var baseUrl = modules.config.application.BASE_URL;

    var jack = {
        plainPassword : 'password',
        deviceType : 'Windows phone',
        devMode : true
    };

    var jill = {
        plainPassword : 'password',
        deviceType : 'Android',
        devMode : true
    };

    beforeEach(function(done) {
        util.removeAllUsers(done);
    });

    describe('Register', function() {
        it('Should return 400 when plainPassword is not provided', function(done) {
            var user = {
                username : 'ahmad',
                deviceType : 'Windows phone',
                devMode : true
            };

            request(baseUrl).post('/relayme/server/api/register').send(user).expect(400, done);
        });

        it('Should return 400 when deviceType is not provided', function(done) {
            var user = {
                username : 'ahmad',
                plainPassword : 'password',
                devMode : true
            };

            request(baseUrl).post('/relayme/server/api/register').send(user).expect(400, done);
        });

        it('Should return 200 when deviceType and plainPassword is provided', function(done) {
            var user = {
                username : 'ahmad',
                plainPassword : 'password',
                deviceType : 'Windows phone',
                devMode : true
            };

            request(baseUrl).post('/relayme/server/api/register').send(user).end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                res.body.username.should.not.be.empty;
                done();
            });
        })
    });

    describe('user get', function() {
        it('Should return 401 when there is no authorization', function(done) {
            request(baseUrl).get('/relayme/server/api/user').expect(401, done);
        });

        it('Should return 200 with user info', function(done) {
            util.registerUser(jack, function(response) {
                var auth = new Buffer(response.username + ':' + 'password').toString('base64');
                request(baseUrl).get('/relayme/server/api/user').set('authorization', 'Basic ' + auth).end(
                        function(err, res) {
                            if (err) {
                                throw err;
                            }
                            res.status.should.equal(200);
                            res.body.username.should.be.exactly(response.username);
                            res.body.deviceType.should.be.exactly(response.deviceType);
                            done();
                        });
            });
        });
    });

    describe('user post', function() {
        it('Should return 401 when there is no authorization', function(done) {
            request(baseUrl).post('/relayme/server/api/user').expect(401, done);
        });

        it('Should change user properties', function(done) {
            util.registerUser(jack, function(response) {
                var auth = new Buffer(response.username + ':' + 'password').toString('base64');
                response.username = 'new username';
                response.email = 'a@b.com';
                // Update user
                request(baseUrl).post('/relayme/server/api/user').set('authorization', 'Basic ' + auth).send(response)
                        .expect(
                                200,
                                function() {
                                    // Get the same user
                                    var auth = new Buffer(response.username + ':' + 'password').toString('base64');
                                    request(baseUrl).get('/relayme/server/api/user').set('authorization',
                                            'Basic ' + auth).end(function(err, res) {
                                        if (err) {
                                            throw err;
                                        }
                                        res.status.should.equal(200);
                                        res.body.username.should.be.exactly("new username");
                                        res.body.email.should.be.exactly("a@b.com");
                                        done();
                                    });

                                });

            });
        });

        it('Should retuen 409 if user name already exist', function(done) {
            util.registerUser(jack, function(response) {
                var auth = new Buffer(response.username + ':' + 'password').toString('base64');
                response.email = "a@b.com";
                response.username = "new username";
                // Update user
                request(baseUrl).post('/relayme/server/api/user').set('authorization', 'Basic ' + auth).send(response)
                        .expect(
                                200,
                                function() {
                                    util.registerUser(jill,
                                            function(response2) {
                                                var auth = new Buffer(response2.username + ':' + 'password')
                                                        .toString('base64');
                                                response2.email = "a@b.com";
                                                response2.username = "new username";
                                                // Update user
                                                request(baseUrl).post('/relayme/server/api/user').set('authorization',
                                                        'Basic ' + auth).send(response2).expect(409, done);
                                            });

                                });
            });
        });

    });

    // FIXME: Add a test to make sure that an empty username cannot be accepted when updating user details
    // FIXME: Add a test to make sure that username cannot be updated if it is already taken up

});
