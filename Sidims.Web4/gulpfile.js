﻿'use strict';
// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var del = require('del');
var order = require('gulp-order');

// include plug-ins
var changed = require('gulp-changed');
var minifyHTML = require('gulp-minify-html');


var config = {
    //Include all js files but exclude any min.js files
    src: ['app/**/*.js',
        '!app/services/**/*.js',
        '!app/common/**/*.js',
        '!app/*.js',
        '!app/**/*.min.js'
    ]
}

var vendorConfig = {
    src: [
        'assets/Scripts/angular-sanitize.js',
        'assets/Scripts/bootstrap.js',
        'assets/Scripts/moment.js',
        'assets/Scripts/angular-route.js',
        'assets/Scripts/toastr.js',
        'assets/Scripts/angular-animate.js',
        'assets/Scripts/ngplus-overlay.js',
        'assets/Scripts/angular-fullscreen.js',
        'assets/Scripts/ngPrint.js',
        'assets/js/oc-lazyload/ocLazyLoad.min.js',
        'assets/Scripts/angular-cookies.min.js',
        'assets/Scripts/angular-local-storage.min.js',

        'assets/scripts/breeze.debug.js',
        'assets/scripts/breeze.angular.js',
        'assets/scripts/breeze.directives.js',
        'assets/scripts/breeze.saveErrorExtensions.js',
        'assets/Scripts/breeze.metadata-helper.js',
        'assets/Scripts/angular.breeze.storagewip.js',
        'assets/Scripts/ngplus-overlay.js',
        'assets/scripts/ui-bootstrap-tpls-0.10.0.js',

        'assets/js/TweenMax.min.js',
        'assets/js/joinable.js',
        'assets/js/resizeable.js',
        'app/xenon-custom.js',
        
    ]
}

//delete the output file(s)
gulp.task('clean', function () {
    return del(['app/all.min.js']);
});

gulp.task('vendor-scripts', ['clean'], function () {

    var vendorPath = {
        venSrc: [
            './scripts/*.js', '!*.min.js', '!/**/*.min.js',
        ],
        venDest: './contentbuild/vendor/'
    };

    return gulp.src(vendorPath.venSrc)
      .pipe(uglify())
      .pipe(concat('vendor.min.js'))
      .pipe(gulp.dest(vendorPath.venDest));
});

gulp.task('vendors', ['clean'], function () {

    var vendorPath = {
        venSrc: [

            'assets/js/jquery-1.11.1.min.js',

            'assets/scripts/angular-sanitize.js',
            'assets/scripts/angular-local-storage.min.js',
            'assets/scripts/ngplus-overlay.js',
            'assets/scripts/angular-cookies.min.js',
            'assets/scripts/angular-fullscreen.js',

            'assets/scripts/breeze.debug.js',
            'assets/scripts/breeze.angular.js',
            'assets/scripts/breeze.directives.js',
            'assets/scripts/breeze.saveErrorExtensions.js',
            'assets/Scripts/breeze.metadata-helper.js',

            'assets/scripts/moment.js',
            'assets/scripts/toastr.js',
            'assets/scripts/ngprint.js',
            'assets/scripts/bootstrap.js',


            'assets/Scripts/angular.breeze.storagewip.js',
            'assets/scripts/ui-bootstrap-tpls-0.10.0.js',
            'assets/Scripts/ngplus-overlay.js',

            'assets/js/TweenMax.min.js',
            'assets/js/joinable.js',
            'assets/js/resizeable.js',

            'app/common/bootstrap/bootstrap.dialog.js',
            'assets/js/oc-lazyload/ocLazyLoad.js',

            'app/xenon-custom.js'
        ],
        venDest: './contentbuild/vendor/'
    };

    return gulp.src(vendorPath.venSrc)
        .pipe(uglify())
        .pipe(concat('vendors.min.js'))
        .pipe(gulp.dest(vendorPath.venDest));
});

gulp.task('scripts', ['clean'], function () {

    var appPath = {
        src: [
            'app/**/*.js',
            '!app/services/**/*.js',
            '!app/common/**/*.js',
            '!app/*.js',
            '!app/**/*.min.js'
        ],
        dest: './contentbuild/app/'
    };

    return gulp.src(appPath.src)
      .pipe(uglify())
      .pipe(concat('all.min.js'))
      .pipe(gulp.dest(appPath.dest));
});

gulp.task('scripts2', ['clean'], function () {

    var appPath = {
        src: [

            'app/config.js',
            'app/config.exceptionHandler.js',
            'app/config.route.js',
            'app/constant.js',

            'app/common/common.js',
            'app/common/logger.js',
            'app/common/spinner.js',


            'app/services/cardengr/**/*.js',
            'app/services/inventory/**/*.js',
            'app/services/mailing/**/*.js',

            'app/services/customerservice/**/*.js',
            'app/services/materialaudit/**/*.js',
            'app/services/printing/**/*.js',
            'app/services/rm/**/*.js',
            'app/services/sadmin/**/*.js',
            'app/services/supervisor/**/*.js',
            'app/services/qac/**/*.js',

            'app/services/resource/**/*.js',
            'app/services/repository.application.js',

            'app/services/resourceService.js',
            'app/services/accountService.js',
            'app/services/authService.js',
            'app/services/authInterceptorService.js',
            'app/services/datacontext.js',
            'app/services/entityManagerFactory.js',
            'app/services/model.js',
            
            'app/services/repositories.js',
            'app/services/repository.abstract.js',
            'app/services/resourceService.js',
            'app/services/repository.lookup.js'
        ],
        dest: './contentbuild/app/'
    };

    return gulp.src(appPath.src)
        .pipe(uglify())
        .pipe(concat('service.min.js'))
        .pipe(gulp.dest(appPath.dest));
});

gulp.task('scripts3', ['clean'], function () {

    var appPath = {
        src: [
            'app/services/cardengr/**/*.js',
            'app/services/inventory/**/*.js',
            'app/services/mailing/**/*.js',
        ],
        dest: './contentbuild/app/'
    };

    return gulp.src(appPath.src)
        .pipe(uglify())
        .pipe(concat('service2.min.js'))
        .pipe(gulp.dest(appPath.dest));
});


// minify new or changed HTML pages
gulp.task('minify-html', function () {
    var opts = { empty: true, quotes: true };
    var htmlPath = { htmlSrc: './app/**/*.html', htmlDest: './appbuild/views' };

    return gulp.src(htmlPath.htmlSrc)
      .pipe(changed(htmlPath.htmlDest))
      .pipe(minifyHTML(opts))
      .pipe(gulp.dest(htmlPath.htmlDest));
});

// CSS concat, auto prefix, minify, then rename output file
gulp.task('minify-css', ['fonts'], function () {
    var cssPath = {
        cssSrc: [
            './content/*.css', '!*.min.css', '!/**/*.min.css',
        ],
        cssDest: './contentbuild/css/'
    };

    return gulp.src(cssPath.cssSrc)
        .pipe(order([
            'content/ie10mobile.css',
            'content/bootstrap.css',
            'content/font-awesome.css',
            'content/bootstrap-responsive.css',
            'content/styles.css',
            'content/breeze.directives.css',

            'content/xenon-core.css',
            'content/xenon-forms.css',
            'content/xenon-components.css',
            'content/xenon-skins.css',
            'content/custom.css'

        ]))
      .pipe(concat('styles.css'))
      .pipe(autoprefix('last 2 versions'))
      .pipe(minifyCSS())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(cssPath.cssDest));
});

gulp.task('fonts', function () {
    var fontPath = {
        fontSrc: [
            './content/font/*.*', './content/fonts/*.*',
        ],
        fontDest: './contentbuild/fonts/'
    };

    return gulp.src(fontPath.fontSrc)
        .pipe(gulp.dest(fontPath.fontDest));
});


//Set a default tasks
//gulp.task('default', ['scripts'], function () { });

// default gulp task
gulp.task('default', ['minify-html', 'vendor-scripts', 'scripts', 'minify-css'], function () {
    // watch for HTML changes
    gulp.watch('./app/**/*.html', ['minify-html']);
    // watch for JS changes
    gulp.watch('./app/**/*.js', ['scripts']);
    // watch for CSS changes
    gulp.watch('./content/css/*.css', ['minify-css']);
});