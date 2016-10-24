var gulp            = require('gulp'),
    sass            = require('gulp-sass'),
    clean           = require('gulp-clean'),
    concatCss       = require("gulp-concat-css"),
    concat          = require("gulp-concat"),
    minifyCss       = require('gulp-minify-css'),
    jshint          = require('gulp-jshint'),
    uglify          = require('gulp-uglify'),
    del             = require('del'),
    DEV_FOLDER      = "./dev",
    APP_FOLDER      = "./app",
    JS_FOLDER       = "/javascript",
    CSS_FOLDER      = "/style",
    iMAGE_FOLDER    = "/images" ;


gulp.task("move", function(){
    gulp.src([
      DEV_FOLDER + "/**/**.html",
      DEV_FOLDER + "/**/**.png",
      DEV_FOLDER + "/**/**.jpg",
      DEV_FOLDER + "/**/**.gif",
      DEV_FOLDER + "/**/**.svg",
      DEV_FOLDER + "/**/**.json",
    ]).pipe(gulp.dest('./app'))
});

gulp.task("lint", function(){
return gulp.src(DEV_FOLDER + JS_FOLDER+'/')
    .pipe(jshint())
    .pipe(jshint.reporter('fail'));
});

gulp.task("javascript", ['lint'],function(){
    return gulp.src([
      DEV_FOLDER + JS_FOLDER +"/getData.js",
      DEV_FOLDER + JS_FOLDER +"/manager.js",
      DEV_FOLDER + JS_FOLDER +"/inbox.js",
      DEV_FOLDER + JS_FOLDER +"/reply.js",
      DEV_FOLDER + JS_FOLDER +"/actions.js",
    ])
    // .pipe(uglify())
    .pipe(concat("main.js"))
    .pipe(gulp.dest(APP_FOLDER + JS_FOLDER));
});

//dev
gulp.task('sync', ['build'], function() {
  gulp.watch(DEV_FOLDER + CSS_FOLDER+ '/**/**.scss', ["styles"]);
  gulp.watch(DEV_FOLDER + '/**/**.html', ["move"]);
  gulp.watch(DEV_FOLDER + JS_FOLDER+ '/**/**',["javascript"]);
  gulp.watch(DEV_FOLDER + iMAGE_FOLDER + '/**/**',["move"]);
});


gulp.task('styles', function () {
  return gulp.src([
      DEV_FOLDER + CSS_FOLDER + '/main.scss'
    ])
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(gulp.dest(APP_FOLDER+ CSS_FOLDER +'/'))
});
//
gulp.task('clean', function() {
  console.log("cleaning...")
  return del([APP_FOLDER + '/**','!'+APP_FOLDER])
});

gulp.task("generate", ['javascript','styles', 'move']);

gulp.task("build", ["clean"], function(){
  gulp.run('generate');
});

gulp.task('default', ['sync']);
