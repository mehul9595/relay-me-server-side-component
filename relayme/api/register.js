var uuid = require('node-uuid');

module.exports = function(baseUrl, app, modules) {
    var registerUser = function(req, res) {
        function validateRequest(req, res) {
            if (req.body.plainPassword === undefined) {
                res.status(400).send('Provide plainPassword');
                return false;
            }
            if (req.body.deviceType === undefined) {
                res.status(400).send('Provide deviceType');
                return false;
            } else {
                return true;
            }
        }

        if (validateRequest(req, res)) {

            var crypto = require('crypto'), text = req.body.plainPassword, hash;
            crypto.randomBytes(64, function(ex, buf) {
                if (ex)
                    throw ex;
                var buffer = new Buffer(buf, 'binary');
                var salt = buffer.toString('hex');
                // console.log('Salt used to encrypt the password (in hex): %s', salt);
                hash = crypto.createHmac('sha512', buf).update(text).digest('hex');
                // console.log('Hash stored in database: %s', hash);

                var registrationRequest = {
                    username : uuid.v4(),
                    passwordHash : hash,
                    salt : salt,
                    email : req.body.email,
                    deviceType : req.body.deviceType,
                    deviceSubType : req.body.deviceSubType,
                    deviceVersion : req.body.deviceVersion,
                    devMode : req.body.devMode,
                    appVersion : req.body.appVersion
                };
                modules.storage.addUser(registrationRequest, function(registeredUser) {
                    // TODO: Extract
                    var result = {
                        username : registeredUser.username,
                        email : registeredUser.email,
                        dateCreated : registeredUser.dateCreated,
                        dateLastModified : registeredUser.dateLastModified,
                        deviceType : registeredUser.deviceType,
                        deviceSubType : registeredUser.deviceSubType,
                        deviceVersion : registeredUser.deviceVersion,
                        devMode : registeredUser.devMode,
                        appVersion : registeredUser.appVersion
                    };
                    console.log('registerUser successful: %s', result.username);
                    res.status(200).json(result);
                }, function(errorMessage) {
                    console.log('registerUser failed: %s', errorMessage);
                    res.status(500).send(errorMessage);
                });
            });
        }
    };

    app.post(baseUrl, registerUser);
}
