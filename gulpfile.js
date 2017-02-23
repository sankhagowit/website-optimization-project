/*jslint node: true*/
'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    webserver = require('gulp-webserver'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    concatify = require('gulp-concat'),
    minifyhtml = require('gulp-minify-html'),
    gzip = require('gulp-gzip'),
    imageResize = require('gulp-image-resize'),
    rename = require('gulp-rename'),
    livereload = require('gulp-livereload'); //okay maybe I figure out livereload later..

// File Paths to Development Code ... I've double checked these are correct
var paths = {
    scripts: ['js/*.js','views/js/*.js'],
    styles: ['css/*.css','views/css/*.css'],
    images: ['img/*', 'views/images/*'],
    content: ['./index.html', './project-2048.html', './project-mobile.html', './project-webperf.html', './views/pizza.html']
};

// JavaScript Gulp Tasks - Concat(none), Minify, Compress
// using gulp-uglify package
// Concats & minifies js files and outputs them to build/js/app.js
gulp.task('scripts', function() {
    return gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gzip())
        .pipe(gulp.dest('./public/js/'))
        .pipe(livereload());
});

// Concat and Minify CSS
gulp.task('styles', function(){
    return gulp.src(paths.styles)
        .pipe(minifyCSS())
        .pipe(gzip())
        //.pipe(concatify()) //I'm confused on how to use concat with a task runner - will probably inline the minified css anyways...
        .pipe(gulp.dest('./public/css/'))
        .pipe(livereload());
});

// Minifies HTML files and outputs them to build/*.html
// Want to test to see if I can use paths.content to prepend paths to gulp.dest
gulp.task('content', function() {
    return gulp.src(paths.content)
        .pipe(minifyhtml({
            empty: true,
            quotes: true
        }))
        .pipe(gzip())
        .pipe(gulp.dest('./public'))
        .pipe(livereload());  //I think this is how this works?
});

// Optimizes our image files and outputs them to build/image/*
gulp.task('images', function() {
    return gulp.src(paths.images)
                .pipe(imagemin({
                    optimizationLevel: 5
                }))
                .pipe(gulp.dest('./public/img'))
                .pipe(livereload());
});

// Resize images for use as thumbnails..
// look at gulpjs documentation again good stuff there (parallel)
gulp.task('resize', function(){
    gulp.src(paths.images)
    .pipe(imageResize({
      width: 200,
    }))
    .pipe(rename(function(path){path.basename += "-thumbnail";}))
    .pipe(gulp.dest('./public/img'));
});

// Watches for changes to our files and executes required scripts
gulp.task('watch', function() {
    livereload.listen(); // Do I need to include a basePath key value pair?
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.content, ['content']);
    gulp.watch(paths.images, ['images']);
});

// Launches a test webserver
gulp.task('webserver', function() {
    gulp.src('public')
        .pipe(webserver({
            livereload: true,
            port: 8080
        }));
});

gulp.task('default', ['watch', 'webserver']);
