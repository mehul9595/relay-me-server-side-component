/*
 * Warning: Don't modify this file, unless you know what you are doing.
 */

module.exports = function() {
    
    var config = {};
    config.database = {};

    // Database
    config.database.URL = process.env.RELAYME_DATABASE_URL || 'localhost:27017/relayme';
    config.database.SESSION_STORAGE_SECRET = '$ecr3t!?';

    return config;
}
