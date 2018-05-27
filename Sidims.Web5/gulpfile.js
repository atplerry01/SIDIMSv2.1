'use strict';
// include plug-ins
var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var autoprefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var changed = require('gulp-changed');
var minifyHTML = require('gulp-minify-html');
const stripCssComments = require('gulp-strip-css-comments');
var order = require("gulp-order");
var del = require('del');


// CSS concat, auto prefix, minify, then rename output file
gulp.task('clean', function() {
    return del(['./contentbuild/all.min.js']);
});

gulp.task('minify-css', function() {
    var cssPath = {
        cssSrc:
            ['./content/fonts/*.css',
                './content/xenon/*.css',
                './content/**/*.css',
                '!*.min.css',
                '!/**/*.min.css'],
        cssDest: './contentbuild/css/'
    };

    return gulp.src(cssPath.cssSrc)
        .pipe(stripCssComments())
        .pipe(order([
            'content/**/*.css',
            'content/bootstrap.css',
            'content/xenon/xenon-components.css',
            'content/xenon/xenon-core.css',
            'content/xenon/xenon-forms.css',
            'content/xenon/xenon-skins.css',
            'content/xenon/custom.css'
        ]))
        .pipe(concat('styles.css'))
        .pipe(autoprefix('last 2 versions'))
        .pipe(minifyCSS())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(cssPath.cssDest));
});

gulp.task('vendor-scripts', ['clean'], function() {

    var vendorPath = {
        src:
            [
                './scripts/vendors/*.js',
            ],
        dest: './contentbuild/js/'
    };

    return gulp.src(vendorPath.src)
        .pipe(uglify())
        .pipe(concat('vendor.min.js'))
        .pipe(gulp.dest(vendorPath.dest));
});

gulp.task('services-scripts', ['clean'], function() {

    var servicePath = {
        src: [

            'app/config.js',
            'app/config.exceptionHandler.js',
            'app/config.route.js',
            'app/constant.js',

            'app/common/common.js',
            'app/common/logger.js',
            'app/common/spinner.js',
            'app/common/bootstrap/bootstrap.dialog.js',
            
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
        dest: './contentbuild/js/'
    };

    return gulp.src(servicePath.src)
        .pipe(uglify())
        .pipe(concat('service.min.js'))
        .pipe(gulp.dest(servicePath.dest));
});

gulp.task('scripts', ['clean'], function() {

    var appPath = {
        src: [
            'app/**/*.js',
            'app/config.route.js',
            '!app/services/**/*.js',
            '!app/common/**/*.js',
            '!app/*.js',
            '!app/**/*.min.js'
        ],
        dest: './contentbuild/js/'
    };

    return gulp.src(appPath.src)
        .pipe(uglify())
        .pipe(concat('all.min.js'))
        .pipe(gulp.dest(appPath.dest));
});

gulp.task('default', ['vendor-scripts', 'scripts', 'minify-css'], function() {
    // watch for HTML changes
    //gulp.watch('./app/**/*.html', ['minify-html']);
    // watch for JS changes
    gulp.watch('./app/**/*.js', ['scripts', 'services-scripts']);
    // watch for CSS changes
    gulp.watch('./content/**/*.css', ['minify-css']);
});