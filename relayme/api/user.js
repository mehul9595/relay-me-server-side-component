var passport = require('passport');

var MIN_PASSWORD_LENGTH = 8;

module.exports = function(baseUrl, app, modules) {
    var getUserDetails = function(req, res) {
        // Already extracted in authentication and does exist in request object
        var result = {
            username : req.user.username,
            email : req.user.email,
            dateCreated : req.user.dateCreated,
            dateLastModified : req.user.dateLastModified,
            deviceType : req.user.deviceType,
            deviceSubType : req.user.deviceSubType,
            deviceVersion : req.user.deviceVersion,
            devMode : req.user.devMode,
            appVersion : req.user.appVersion
        };
        res.status(200).json(result);
    };

    var updateUser = function(req, res) {
        var userProperties = req.user;
        // We only allow updating username and email.
        if (!req.body.username && !req.body.email) {
            res.status(400).send('Invalid request, please provide username or email address.');
            return;
        }
        if (req.body.username) {
            userProperties.username = req.body.username;
        }
        if (req.body.email) {
            userProperties.email = req.body.email;
        }
        modules.storage.updateUser(userProperties, function(updatedUserDetails) {
            var result = {
                username : updatedUserDetails.username,
                email : updatedUserDetails.email,
                dateCreated : updatedUserDetails.dateCreated,
                dateLastModified : updatedUserDetails.dateLastModified,
                deviceType : updatedUserDetails.deviceType,
                deviceSubType : updatedUserDetails.deviceSubType,
                deviceVersion : updatedUserDetails.deviceVersion,
                devMode : updatedUserDetails.devMode,
                appVersion : updatedUserDetails.appVersion
            };
            console.log('updateUser successful: %s', JSON.stringify(result));
            res.status(200).json(result);
        }, function(errorMessage) {
            console.log('updateUser failed: ' + errorMessage.index);
            if (errorMessage.toString().indexOf('E11000') >= 0) {
                res.status(409).send(errorMessage);
            } else {
                res.status(500).send(errorMessage);
            }
        });
    };

    app.get(baseUrl, passport.authenticate('relayme-basic'), getUserDetails);
    app.post(baseUrl, passport.authenticate('relayme-basic'), updateUser);
}
