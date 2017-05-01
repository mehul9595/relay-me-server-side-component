var register = require('./register');
var applicationProperties = require('./applicationproperties');
var user = require('./user');
var keys = require('./keys');

module.exports = function(baseUrl, app, modules) {
    var passport = require('passport');
    var BasicStrategy = require('passport-http').BasicStrategy;

    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    app.use(baseUrl, passport.initialize());

    register(baseUrl + '/register', app, modules);
    user(baseUrl + '/user', app, modules);
    keys(baseUrl + '/keys', app, modules);
    applicationProperties(baseUrl + '/applicationproperties', app, modules);
}