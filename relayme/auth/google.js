var passport = require('passport');
var util = require('util');
var googleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(baseUrl, app, modules) {
    // API Access link for creating client ID and secret:
    // https://code.google.com/apis/console/
    var GOOGLE_CLIENT_ID = modules.config.google.CLIENT_ID;
    var GOOGLE_CLIENT_SECRET = modules.config.google.CLIENT_SECRET;

    // Passport session setup.
    // To support persistent login sessions, Passport needs to be able to
    // serialize users into and deserialize users out of the session. Typically,
    // this will be as simple as storing the user ID when serializing, and finding
    // the user by ID when deserializing. However, since this example does not
    // have a database of user records, the complete Google profile is
    // serialized and deserialized.
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    // Use the googleStrategy within Passport.
    // Strategies in Passport require a `verify` function, which accept
    // credentials (in this case, an accessToken, refreshToken, and Google
    // profile), and invoke a callback with a user object.
    passport.use('relayme-google', new googleStrategy({
        clientID : GOOGLE_CLIENT_ID,
        clientSecret : GOOGLE_CLIENT_SECRET,
        callbackURL : modules.config.google.CALLBACK_URL
    }, function(accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function() {
            // based on device
            // Android: codolutions.relayme://localhost/settings?provider=twitter&
            // Windows: codolutions.relayme://?provider=twitter&param

            profile['accessToken'] = accessToken;
            profile['refreshToken'] = refreshToken;

            // To keep the example simple, the user's Google profile is returned to
            // represent the logged-in user. In a typical application, you would
            // want
            // to associate the Google account with a user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }));

    app.get(baseUrl + '/account', ensureAuthenticated, function(req, res) {
        res.render('google/account', {
            user : req.user
        });
    });

    app.get(baseUrl + '/login', passport.authenticate('relayme-basic-url'), function(req, res) {
        req.session.basicUser = req.user;
        req.session.debug = req.query.debug;
        req.session.appname = req.query.appname;
        if (req.query.debug === 'true') {
            res.redirect(baseUrl + '/debug?authorization=' + req.query.authorization);
        } else {
            res.redirect(baseUrl + '?authorization=' + req.query.authorization);
        }
    });

    // GET /relayme/server/auth/google
    // Use passport.authenticate() as route middleware to authenticate the
    // request. The first step in Google authentication will involve
    // redirecting the user to google.com. After authorization, Google
    // will redirect the user back to this application at /relayme/server/auth/google/callback
    app.get(baseUrl, passport.authenticate('relayme-basic-url'), passport.authenticate('relayme-google', {
        scope : [ 'https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email',
                'https://mail.google.com/' ],
        accessType : 'offline',
        approvalPrompt : 'force'
    }), function(req, res) {
        // The request will be redirected to Google for authentication, so this
        // function will not be called.
    });

    app.get(baseUrl + '/debug', passport.authenticate('relayme-basic-url'), function(req, res) {
        res.render('google/debug', {
            redirecturl : baseUrl + '?authorization=' + req.query.authorization,
            appname : req.session.appname
        });
    });

    // GET /relayme/server/auth/google/callback
    // Use passport.authenticate() as route middleware to authenticate the
    // request. If authentication fails, the user will be redirected back to the
    // login page. Otherwise, the primary route function function will be called,
    // which, in this example, will redirect the user to the home page.
    app.get(baseUrl + '/callback', passport.authenticate('relayme-google', {
        failureRedirect : '/'
    }), function(req, res) {
        // pass following two numbers to the device
        redirectUrl = modules.deviceRedirector(req.session.basicUser.deviceType, req.session.basicUser.deviceVersion,
                'provider=google&refreshToken=' + req.user.refreshToken + '&accessToken=' + req.user.accessToken);

        if (req.session.debug === 'true') {
            console.log('Redirecting to: ' + redirectUrl);
            res.render('google/account', {
                user : req.user,
                basicUser : req.session.basicUser,
                url : redirectUrl
            });
        } else {
            res.redirect(redirectUrl);
        }
    });

    app.get(baseUrl + '/logout', function(req, res) {
        req.logout();
        res.redirect(baseUrl);
    });

    // Simple route middleware to ensure user is authenticated.
    // Use this route middleware on any resource that needs to be protected. If
    // the request is authenticated (typically via a persistent login session),
    // the request will proceed. Otherwise, the user will be redirected to the
    // login page.
    function ensureAuthenticated(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect(baseUrl);
    }
}
