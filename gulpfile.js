const gulp = require('gulp');
const server = require('gulp-server-livereload');
const sass = require('gulp-sass');
const inlineCss = require('gulp-inline-css');

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
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('watch', function () {
    gulp.watch('./app/sass/**/*.scss', ['sass', 'inject']);
    gulp.watch('./app/*.html', ['inject']);
});

gulp.task('inject', function() {
    return gulp.src('./app/*.html')
        .pipe(inlineCss())
        .pipe(gulp.dest('./dist/'));
});

// gulp.task('watch', ['sass:watch']);

gulp.task('default', ['sass', 'inject', 'webserver', 'watch']);
