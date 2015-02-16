var gulp = require('gulp');

var $ = require('gulp-load-plugins')();

gulp.task('test', function() {
  require('should');

  gulp.src('test/**/*')
      .pipe($.plumber())
      .pipe($.mocha({
        reporter: 'spec',
      }))
      .on('error', function(error) {
        console.error('\nError:', error.plugin);
        console.error(error.message);
      });
});


gulp.task('watch', function() {
  function onChange(event) {
    console.log('File', event.type +':', event.path);
  }
  
  gulp.watch('lib/**/*', ['test']).on('change', onChange);
  gulp.watch('test/**/*', ['test']).on('change', onChange);

  if($.util.env.node_modules) // "gulp --node_modules" (Debug only)
    gulp.watch('node_modules/**/*.js', ['test']).on('change', onChange);
});

gulp.task('default', ['dev']);

gulp.task('dev', ['test', 'watch']);