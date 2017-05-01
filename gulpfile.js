var gulp = require('gulp');
var nodemon = require('gulp-nodemon');

// See each module's Gulp file for tasks specific to it.

gulp.task('default', function() {
    nodemon({
        script : 'server.js',
        ignore : [ '**/test/*.js', 'node_modules/**', 'catchup/scripts/**' ]
    }).on('restart', function() {
        console.log('restarted!');
    });
});

