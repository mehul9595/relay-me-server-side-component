module.exports = function() {
    var config = {};
    // Files should be addressed relative to the module's root directory.
    config.REGISTRATION_DATA_FILE = './scripts/data/registration.json';
    config.OAUTH_DATA_FILE = './scripts/data/oauth_links.html';
    // JSON imports should be addressed relative to the calling script.
    config.REGISTRATION_DATA_JSON = './data/registration.json';
    config.PROPERTY_USERNAME = 'username';
    config.PROPERTY_PASSWORD = 'password';
    config.PROPERTY_AUTH_TOKEN = 'auth_token';
    return config;
}
