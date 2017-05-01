var passport = require('passport');

module.exports = function(baseUrl, app, modules) {
    var config = modules.config;
    var storage = modules.storage;
    var security = modules.security;

    var getApplicationProperties = function(req, res) {
        storage.getApplicationProperties(function(applicationProperties) {
            res.status(200).json(applicationProperties);
        }, function(errorMessage) {
            console.log('getApplicationProperties faild: ' + errorMessage);
            res.status(500).json(errorMessage);
        });
    };

    app.get(baseUrl, passport.authenticate('relayme-basic'), getApplicationProperties);
}
