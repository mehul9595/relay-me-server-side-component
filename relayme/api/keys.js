var passport = require('passport');

module.exports = function(baseUrl, app, modules) {
    var config = modules.config;
    var security = modules.security;

    var getKeys = function(req, res) {
        var keys = {
            google : {
                key : security.encryptString(config.google.CLIENT_ID, req.user.username,
                        modules.config.application.encryptionSalt),
                secret : security.encryptString(config.google.CLIENT_SECRET, req.user.username,
                        modules.config.application.encryptionSalt),
                callback : config.google.CALLBACK_URL
            }
        };
        res.status(200).json(keys);
    };

    app.get(baseUrl, passport.authenticate('relayme-basic'), getKeys);
}