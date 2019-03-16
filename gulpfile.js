var gulp = require('gulp');
var nunjucksRender = require('gulp-nunjucks-render');
gulp.task('nunjucks', function() {
  // Gets .html and .nunjucks files in pages
  return gulp.src('pages/**/*.+(njk)')
  // Renders template with nunjucks
  .pipe(nunjucksRender({
      path: ['templates']
    }))
  // output files in app folder
  .pipe(gulp.dest('.'))
});
