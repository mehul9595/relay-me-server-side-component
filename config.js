/*
 * Warning: Don't modify this file, unless you know what you are doing.
 */

module.exports = function() {
    
    var config = {};
    config.database = {};

    // Database
    config.database.URL = "mongodb://relaymongo:relaymongo-$@cluster0-shard-00-00-3lkwz.mongodb.net:27017,cluster0-shard-00-01-3lkwz.mongodb.net:27017,cluster0-shard-00-02-3lkwz.mongodb.net:27017/<DATABASE>?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin"; //process.env.RELAYME_DATABASE_URL || 'localhost:27017/relayme';
    config.database.SESSION_STORAGE_SECRET = '$ecr3t!?';

    return config;
}
