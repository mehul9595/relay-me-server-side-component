// Returns a class that does DB functions.
module.exports = function(modules) {
    var ERROR_RECORD_NOT_FOUND = 'Record not found';
    var ERROR_TOO_MANY_RECORDS_FOUND = 'Too many records found';
    var USER_UPDATE_ON_VERIFICATION_THRESHOLD_IN_MS = 86400000; // 1 day

    var config = modules.config;
    var security = modules.security;

    // mongoose
    var userModel = modules.mongoose_db.model(config.database.COLLECTION_USER);
    var applicationPropertyModel = modules.mongoose_db.model(config.database.COLLECTION_APPLICATION_PROPERTY);

    var RelaymeStorageClass = function() {

        this.init = function() {
            console.log('Using Mongo DB on %s', config.database.URL);
        };
        this.checkUniqueRecord = function(docs, next, err) {
            if (docs.length < 1)
                err(ERROR_RECORD_NOT_FOUND);
            else if (docs.length > 1)
                err(ERROR_TOO_MANY_RECORDS_FOUND);
            else
                next(docs[0]);
        };
        this.checkOptionalSingleRecord = function(docs, next, err) {
            if (docs.length < 1)
                next(undefined);
            else if (docs.length > 1)
                err(ERROR_TOO_MANY_RECORDS_FOUND);
            else
                next(docs[0]);
        };
        this.getUsers = function(_id, next, err) {
            userModel.find({
                '_id' : _id
            }, function(errorMessage, docs) {
                if (errorMessage)
                    err(errorMessage);
                else
                    next(docs);
            });
        };
        this.getUniqueUser = function(_id, next, err) {
            this.getUsers(_id, function(docs) {
                this.checkUniqueRecord(docs, next, err);
            }.bind(this), function(errorMessage) {
                err(errorMessage);
            });
        };
        this.getUsersByUsername = function(username, next, err) {
            userModel.find({
                'username' : username
            }, function(errorMessage, docs) {
                if (errorMessage)
                    err(errorMessage);
                else
                    next(docs);
            });
        };
        this.getUniqueUserByUsername = function(username, next, err) {
            this.getUsersByUsername(username, function(docs) {
                this.checkUniqueRecord(docs, next, err);
            }.bind(this), function(errorMessage) {
                err(errorMessage);
            });
        };
        this.addUser = function(value, next, err) {
            console.log('addUser, username: %s', value.username);
            var user = new userModel(value);

            user.save(user, function(errorMessage, doc) {
                if (errorMessage) {
                    console.log('An error occurred: %s', errorMessage);
                    err(errorMessage);
                } else {
                    this.getUniqueUserByUsername(value.username, function(doc) {
                        next(doc);
                    }, function(errorMessage) {
                        console.log('Newly added user cannot be found: %s', errorMessage);
                        err('Newly added user cannot be found: ' + errorMessage);
                    });
                }
            }.bind(this));
        };
        this.updateUser = function(value, next, err) {
            console.log('updateUser, username: %s', value.username);
            userModel.findOneAndUpdate({
                '_id' : value._id
            }, value, {
                upsert : true
            }, function(errorMessage, doc) {
                if (errorMessage) {
                    console.log('updateUser error: %s', errorMessage);
                    err(errorMessage);
                } else {
                    this.getUniqueUserByUsername(value.username, function(doc) {
                        next(doc);
                    }, function(errorMessage) {
                        console.log('Newly updated user cannot be found: %s', errorMessage);
                        err('Newly updated user cannot be found: ' + errorMessage);
                    });
                }
            }.bind(this));
        };
        this.verifyUser = function(username, password, verified, failed, err) {
            this.getUniqueUserByUsername(username, function(user) {
                // console.log('Checking password %s and salt %s', password, user.salt);
                var hash = security.hashPassword(password, user.salt);
                // console.log('Hash calculated is %s, the hash provided is %s', hash, user.passwordHash);
                if (user.passwordHash === hash) {
                    // console.log('User with username %s is verified in Catch UP.', username);
                    verified(user);
                    var sinceLastModified = new Date().getTime() - (user.dateLastModified ? user.dateLastModified : 0);
                    if (sinceLastModified > USER_UPDATE_ON_VERIFICATION_THRESHOLD_IN_MS) {
                        // Update the user so that we know this user is still active.
                        this.updateUser(user, function() {
                        }, function() {
                        });
                    }
                } else {
                    failed();
                }
            }.bind(this), function error(errorMessage) {
                console.log('Cannot verify user %s: %s', username, errorMessage);
                failed();
            });
        };
        this.getApplicationProperties = function(next, err) {
            applicationPropertyModel.find({}, function(errorMessage, docs) {
                if (errorMessage)
                    err(errorMessage);
                else
                    next(docs);
            });
        };
        this.getApplicationPropertiesByKey = function(key, next, err) {
            applicationPropertyModel.find({
                'key' : key
            }, function(errorMessage, docs) {
                if (errorMessage)
                    err(errorMessage);
                else
                    next(docs);
            });
        };
        this.getUniqueApplicationPropertyByKey = function(key, next, err) {
            this.getApplicationPropertiesByKey(key, function(docs) {
                this.checkUniqueRecord(docs, next, err);
            }.bind(this), function(errorMessage) {
                err(errorMessage);
            });
        };
        this.initializeApplicationProperties = function(next, err) {
            console.log('Initializing application properties');
            for ( var k in config.defaultApplicationProperties) {
                var insertFunction = function(property) {
                    this.getApplicationPropertiesByKey(property.key, function(docs) {
                        if (docs.length >= 1) {
                            return;
                        }
                        console.log('Inserting application property: %s, value: %s', property.key, property.value);
                        applicationPropertyModel.findOneAndUpdate({
                            'key' : property.key
                        }, property, {
                            upsert : true
                        },
                                function(errorMessage, doc) {
                                    if (errorMessage) {
                                        console.log('initializeApplicationProperties find and modify, error: %s',
                                                errorMessage);
                                        err(errorMessage);
                                    } else {
                                        this.getUniqueApplicationPropertyByKey(property.key, function(doc) {
                                        }, function(errorMessage) {
                                            console.log('Newly updated application property cannot be found: %s',
                                                    errorMessage);
                                            err('Newly updated application property cannot be found: ' + errorMessage);
                                        });
                                    }
                                }.bind(this));
                    }.bind(this), function(errorMessage) {
                        console.log('Application property error: %s', errorMessage);
                        err(errorMessage);
                    });
                }.bind(this);
                insertFunction({
                    key : k,
                    value : config.defaultApplicationProperties[k]
                });
            }
        };
    };

    var storage = new RelaymeStorageClass();
    storage.init();
    return storage;
};
