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
            || '740050674724-pktogo9rs0o1p69j32hnij0vogj0bnf0.apps.googleusercontent.com';
    config.google.CLIENT_SECRET = process.env.RELAYME_GOOGLE_CLIENT_SECRET || 'vtqDQvJv7ztpHcXpfg2lC6_r';
    config.google.CALLBACK_URL = process.env.RELAYME_GOOGLE_CALLBACK_URL
            || 'http://codolutionstest.com:3000/relayme/server/auth/google/callback';

    // Database
    config.database.URL = process.env.RELAYME_DATABASE_URL || 'localhost:27017/relayme';
    config.database.COLLECTION_USER = 'user';
    config.database.COLLECTION_APPLICATION_PROPERTY = 'applicationProperty';

    // Application
    config.application.BASE_URL = process.env.BASE_URL || 'http://codolutionstest.com:3000';

    config.defaultApplicationProperties = {
        'android.last.supported.version' : 0,
        'android.latest.known.version' : 1,
        'android.latest.version.name' : '1.0.0'
    }

    return config;
}
