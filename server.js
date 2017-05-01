var express = require('express');
var expressSession = require('express-session');
var MongoStore = require('connect-mongo')(expressSession);
var mongoose = require('mongoose');
var http = require('http');
var app = express();
var ejs = require('ejs');
var passport = require('passport');
var bodyparser = require('body-parser');
var morgan = require('morgan');
var cookieparser = require('cookie-parser');
var methodoverride = require('method-override');
var errorhandler = require('errorhandler');
var requireFrom = require('requirefrom');
var lib = requireFrom('.');
var config = lib('config')();
var relayme = lib('relayme');

app.use(morgan({
    format : 'dev',
    immediate : true
}));

app.use(bodyparser());
app.use(cookieparser());
app.use(methodoverride());

console.log('Setting up mongoose for Codolutions');

var connect = function() {
    var options = { server : { socketOptions : { keepAlive : 1 } } };
    mongoose.connect(config.database.URL, options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

var mongoSessionStore = new MongoStore({
    mongooseConnection : mongoose.connection,
    ttl: 60 * 60, // 1 hour
    autoRemove: 'native'
});

app.use(expressSession({
    secret : config.database.SESSION_STORAGE_SECRET,
    store : mongoSessionStore 
}));

app.use(passport.initialize());
app.use(passport.session({
    secret : 'secret' 
}));

if ('development' == app.get('env')) {
    app.use(errorhandler());
}

app.use(express.static(__dirname + '/website/output'));
app.use(express.static(__dirname + '/website/output/blog'));
app.set('views', process.cwd() + '/relayme/views');
app.set('view engine', 'ejs');
relayme('relayme', '/relayme/server', app);

app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function() {
    console.log('Express server listening on port ' + server.address().port);
});
