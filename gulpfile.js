/*jslint node: true*/
'use strict';

var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    minifyCSS = require('gulp-minify-css'),
    webserver = require('gulp-webserver'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    minifyhtml = require('gulp-minify-html');
    //livereload = require('gulp-livereload'); //okay maybe I figure out livereload later..

// File Paths to Development Code
var paths = {
    scripts: ['js/*.js','bower_components/jquery/dist/jquery.js'],
    styles: ['scss/style.scss','scss/styles/*.scss'],
    images: ['img/*'],
    content: ['index.html', 'project-2048.html', 'project-mobile.html', 'project-webperf.html']
};

// File Paths to Destination (production code)
var dest = {

};

// JavaScript Gulp Tasks - Lint? Concat, Minify, Compress
// using gulp-uglify package
gulp.task('scripts', function(){
    gulp.src(jsSrc)
    .pipe(uglify())
    .pipe(gulp.dest(jsDest));
});

// Minifies our HTML files and outputs them to build/*.html
gulp.task('content', function() {
    return gulp.src(paths.content)
        .pipe(minifyhtml({
            empty: true,
            quotes: true
        }))
        .pipe(gulp.dest('./build'));
});

// Optimizes our image files and outputs them to build/image/*
gulp.task('images', function() {
    return gulp.src(paths.images)
                .pipe(imagemin({
                    optimizationLevel: 5
                }))
                .pipe(gulp.dest('./build/image'));
});

// Watches for changes to our files and executes required scripts
gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['scripts']);
    gulp.watch(paths.styles, ['styles']);
    gulp.watch(paths.content, ['content']);
    gulp.watch(paths.images, ['images']);
});

// Launches a test webserver
gulp.task('webserver', function() {
    gulp.src('build')
        .pipe(webserver({
            livereload: true,
            port: 1111
        }));
});

gulp.task('default', ['watch', 'webserver']);
