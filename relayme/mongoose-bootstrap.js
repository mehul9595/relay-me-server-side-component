var fs = require('fs');
var join = require('path').join;
var mongoose = require('mongoose');

module.exports = function(modules) {
    console.log('Setting up mongoose for Relay ME');

    var connect = function() {
        var options = { server : { socketOptions : { keepAlive : 1 } } };
        modules.mongoose_db = mongoose.createConnection(modules.config.database.URL, options);
    };

    connect();
    modules.mongoose_db.on('error', console.log);
    modules.mongoose_db.on('disconnected', connect);

    fs.readdirSync(join(__dirname, 'models')).forEach(function(file) {
        if (~file.indexOf('.js'))
            require(join(__dirname, 'models', file))(modules.mongoose_db, modules);
    });
};

