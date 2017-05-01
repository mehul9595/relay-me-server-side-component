var gulp = require('gulp');
var nodemon = require('gulp-nodemon');
var mocha = require('gulp-mocha');
var yargs = require('yargs');
var exec = require('child_process').exec;
var env = require('gulp-env');
var runSequence = require('run-sequence');

execNode = function(path, done) {
    exec('node ' + path, function(err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        done(err);
    });
};

gulp.task('run-register', [], function(cb) {
    execNode('./scripts/register.js', cb);
});

gulp.task('run-verify', [], function(cb) {
    execNode('./scripts/verify.js', cb);
});

gulp.task('run-get-keys', [], function(cb) {
    execNode('./scripts/get-keys.js', cb);
});

gulp.task('run-get-applicationproperties', [], function(cb) {
    execNode('./scripts/get-applicationproperties.js', cb);
});

gulp.task('run-all-global', [], function(cb) {
    runSequence('run-verify',
        'run-get-keys',
        'run-get-applicationproperties',
        cb);
});

gulp.task('test-mocha', [], function() {
    return gulp.src('./test/*.js', {
        read: false
    }).pipe(mocha({
        useColors: true,
        grep: yargs.argv.grep,
        timeout: 10000
    })).once('end', function() {
        process.exit();
    });
});

gulp.task('test-mocha-watch', [], function() {
    return gulp.src('./test/*.js', {
        read: false
    }).pipe(mocha({
        useColors: true,
        grep: yargs.argv.grep,
        timeout: 10000
    }));
});

gulp.task('test', ['test-mocha']);

gulp.task('test-watch', ['test-mocha-watch'], function() {
    gulp.watch('./**/test-*.js', ['test-mocha']);
});

gulp.task('default', ['test-watch'], function() {
    gulp.watch('./**/test-*.js', ['test-mocha']);
});
