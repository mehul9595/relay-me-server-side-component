/*
 * Warning: Don't modify this file, unless you know what you are doing.
 */

module.exports = function() {

    var config = {};
    config.application = {};
    config.google = {};
    config.storage = {};
    config.database = {};

    config.application.encryptionSalt = process.env.RELAYME_ENCRYPTION_SALT || 'RiE2MV5YI2ZodG1HbEI0aw==';
    // TODO: Turn this into a map
    config.application.deviceTypeAndroid = 'android';
    config.application.deviceRedirectUrlAndroid = 'codolutions.relayme://localhost/settings';

    // Google API Project created as user info@codolutions.com
    config.google.CLIENT_ID = process.env.RELAYME_GOOGLE_CLIENT_ID
            || '688829950337-75dr77o9thf5eq7k5sras66u7gq688jg.apps.googleusercontent.com';
    config.google.CLIENT_SECRET = process.env.RELAYME_GOOGLE_CLIENT_SECRET || 'eLpHRF_kAgpbw39cbB6CQg5O';
    config.google.CALLBACK_URL = process.env.RELAYME_GOOGLE_CALLBACK_URL
            || 'http://localhost.com:3000/relayme/server/auth/google/callback';

    // Database
    config.database.URL = "mongodb://relaymongo:relaymongo-$@cluster0-shard-00-00-3lkwz.mongodb.net:27017,cluster0-shard-00-01-3lkwz.mongodb.net:27017,cluster0-shard-00-02-3lkwz.mongodb.net:27017/<DATABASE>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin" //"mongodb://ci:0cF3GC0wIOHt@ds127391.mlab.com:27391/relayme-ci" || 'mongodb://ci:0cF3GC0wIOHt@ds127391.mlab.com:27391/relayme-ci';
    config.database.COLLECTION_USER = 'user';
    config.database.COLLECTION_APPLICATION_PROPERTY = 'applicationProperty';

    // Application
    config.application.BASE_URL = process.env.BASE_URL || 'http://localhost.com:3000';

    config.defaultApplicationProperties = {
        'android.last.supported.version' : 0,
        'android.latest.known.version' : 1,
        'android.latest.version.name' : '1.0.0'
    }

    return config;
}
