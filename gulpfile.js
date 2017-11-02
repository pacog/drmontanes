const gulp = require('gulp');
const server = require('gulp-server-livereload');
const sass = require('gulp-sass');
const gulpsync = require('gulp-sync')(gulp);
const inlinesource = require('gulp-inline-source');
const ghPages = require('gulp-gh-pages');

gulp.task('webserver', function() {
    gulp.src('dist')
        .pipe(server({
            livereload: true,
            // directoryListing: true,
            open: true
    }));
});

gulp.task('sass', function () {
    return gulp.src('./app/sass/**/*.scss')
        .pipe(sass.sync().on('error', sass.logError))
        .pipe(gulp.dest('./.tmp/css'));
});

gulp.task('copyAssets', function() {
    return gulp.src('./app/assets/**/*.*')
        .pipe(gulp.dest('./dist/assets'));
});

gulp.task('watch', function () {
    gulp.watch('./app/sass/**/*.scss', gulpsync.sync(['sass', 'inject']));
    gulp.watch('./app/*.html', ['inject']);
    gulp.watch('./app/js/**/*.js', ['inject']);
    gulp.watch('./app/assets/**/*.*', ['copyAssets']);
});

gulp.task('inject', function() {
    const target = gulp.src('./app/*.html');
    return target
        .pipe(inlinesource())
        .pipe(gulp.dest('./dist'));
});

gulp.task('deploy', gulpsync.sync(['sass', 'copyAssets', 'inject', 'gh-pages-upload']));

gulp.task('gh-pages-upload', function() {
  return gulp.src('./dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', gulpsync.sync(['sass', 'copyAssets', 'inject', 'webserver', 'watch']));
