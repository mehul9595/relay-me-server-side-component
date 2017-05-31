/*
 * Warning: Don't modify this file, unless you know what you are doing.
 */

module.exports = function() {
    
    var config = {};
    config.database = {};

    // Database
    config.database.URL = "mongodb://ci:0cF3GC0wIOHt@ds127391.mlab.com:27391/relayme-ci" || 'localhost:27017/relayme';
    config.database.SESSION_STORAGE_SECRET = '$ecr3t!?';

    return config;
}
