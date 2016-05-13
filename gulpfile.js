var gulp        = require('gulp');
var gulpTypings = require("gulp-typings");
var ts          = require('gulp-typescript');
var bower       = require('gulp-bower');
var nodemon     = require('gulp-nodemon');
var git         = require('gulp-git');


// 
// Server
//

// Get server typings
gulp.task("server-typings", function () {
    var stream = gulp.src("./server/typings.json")
        .pipe(gulpTypings())        
        .pipe(gulp.dest('server')); 
    return stream; // by returning stream gulp can listen to events from the stream and knows when it is finished.
});

// compile server
var tsProject = ts.createProject('server/tsconfig.json');
gulp.task('server-scripts', ['server-typings'], function() {    
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));
    return tsResult.js.pipe(gulp.dest('server'));
});

// Incrementally compile server
gulp.task('watch-server', ['server-scripts'], function() {
    gulp.watch('server/*.ts', ['server-scripts']);
});

// RefScript
gulp.task('updateSubmodules', function(){
    git.updateSubmodule({ args: '--init' });
});

gulp.task('start-server', ['updateSubmodules', 'watch-server'], function () {
    nodemon({ script: 'server/index.js' });
})


// 
// Client
//

// Bower
gulp.task('bower', function() {
    return bower();
});

// Get server typings
gulp.task("client-typings", function () {
    var stream = gulp.src("./scripts/typings.json")
        .pipe(gulpTypings())        
        .pipe(gulp.dest('scripts')); 
    return stream;
});

// compile server
var tsProject = ts.createProject('scripts/tsconfig.json');
gulp.task('client-scripts', ['client-typings'], function() {    
    var tsResult = tsProject.src()
        .pipe(ts(tsProject));
    return tsResult.js.pipe(gulp.dest('scripts'));
});

// Incrementally compile server
gulp.task('watch-client', ['client-scripts'], function() {
    gulp.watch('scripts/*.ts', ['client-scripts']);
});

gulp.task('default', ['bower', 'start-server']); // , 'watch-client']);
