var fs = require('fs');
var join = require('path').join;
var express = require('express');
var path = require('path');
var passport = require('passport');
var requireFrom = require('requirefrom');
var git = require('git-rev');
var mongoose = require('mongoose');
var api = require('./api');
var auth = require('./auth');
var pack = require('./package.json');
var mongooseBootstrap = require('./mongoose-bootstrap');

module.exports = function(moduleDir, baseUrl, app) {
    console.log('Starting Relay ME on %s from %s', baseUrl, moduleDir);

    // Some utilities that can be used by submodules.
    var modules = {};
    modules.lib = requireFrom(moduleDir);
    modules.pack = modules.lib('package.json');
    modules.config = modules.lib('config.js')();

    // Once configuration is read, we can create connections to database.
    mongooseBootstrap(modules);

    // Initializing rest, as they may depend on database model.
    modules.basicUrlStrategy = modules.lib('strategies/basic-url');
    modules.basicStrategy = require('passport-http').BasicStrategy;
    modules.views = requireFrom(moduleDir + 'views');
    modules.security = modules.lib('core/security')(modules);
    modules.deviceRedirector = modules.lib('core/device-redirector')(modules);
    modules.storage = modules.lib('core/storage')(modules);
    modules.storage.initializeApplicationProperties();

    // Use the BasicStrategy within Passport.
    // Strategies in Passport require a `verify` function, which accept
    // credentials (in this case, a key and password), and invoke a callback
    // with a user object.
    passport.use('relayme-basic-url', new modules.basicUrlStrategy({}, function(key, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            // Find the user by key. If there is no user with the given
            // key, or the password is not correct, set the user to `false` to
            // indicate failure. Otherwise, return the authenticated `user`.
            modules.storage.verifyUser(key, password, function(func) {
                return done(null, func);
            }, function() {
                return done(null, false);
            }, function() {
                return done(null, false);
            });
        });
    }));
    passport.use('relayme-basic', new modules.basicStrategy(function(key, password, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            // Find the user by key. If there is no user with the given
            // key, or the password is not correct, set the user to `false` to
            // indicate failure. Otherwise, return the authenticated `user`.
            modules.storage.verifyUser(key, password, function(func) {
                return done(null, func);
            }, function() {
                return done(null, false);
            }, function() {
                return done(null, false);
            });
        });
    }));

    api(baseUrl + '/api', app, modules);
    auth(baseUrl + '/auth', app, modules);
    app.get(baseUrl + '/env', function(req, res) {
        git.short(function(revision) {
            git.branch(function(branch) {
                res.render('env', {
                    env_name : app.get('env'),
                    revision : revision,
                    branch : branch
                });
            })
        });
    });
    app.use(baseUrl + "/", express.static(__dirname + '/views/public'));
}
