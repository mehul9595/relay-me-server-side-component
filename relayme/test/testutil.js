
var request = require('supertest');
var mongooseBootstrap = require('../mongoose-bootstrap');

if (global.server === undefined) {
    global.server = require('../../server');    
}



var modules = {};

module.exports = function() {
    modules.pack = require('../package.json');
    modules.config = require('../config.js')();
    var baseUrl = modules.config.application.BASE_URL;
    mongooseBootstrap(modules);
    modules.storage = require('../core/storage.js')(modules);
    modules.security = require('../core/security.js')(modules);

    var testUtil = {
        getModules : function() {
            return modules;
        },
        registerUser : function(user, done) {
            request(baseUrl).post('/relayme/server/api/register').send(user).end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.status.should.equal(200);
                res.body.username.should.not.be.empty;
                done(res.body);
            });
        },
        setAuthToken : function(user, response) {
            user.auth = new Buffer(response.username + ':' + 'password').toString('base64');
            user.username = response.username;
        },
        removeAllUsers : function(done) {
            var UserModel = modules.mongoose_db.model('user');
            UserModel.remove(function() {
                done();
            });
        },
        removeAllLicenses : function(done) {
            var LicenseModel = modules.mongoose_db.model('license');
            LicenseModel.remove(function() {
                done();
            });
        },
        removeAllApplicationProperties : function(done) {
            var ApplicationPropertyModel = modules.mongoose_db.model('applicationProperty');
            ApplicationPropertyModel.remove(function() {
                done();
            });
        }
    };
    return testUtil;
};
