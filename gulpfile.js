'use strict';
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var istanbul = require('gulp-istanbul');
var mocha = require('gulp-mocha');
var coverageEnforcer = require('gulp-istanbul-enforcer');
var runSequence = require('run-sequence');
var nodemon = require('gulp-nodemon');

var globs = {
  js: {
    lib: ['routes/*.js', 'db/*.js', 'app.js', 'bin/www'],
    gulpfile: ['gulpfile.js'],
    specs: ['tests/unit_tests/*.js', '!tests/fixtures/**/*']
  },
  specs: ['tests/*/*.js', '!tests/fixtures/**/*'],
  views: ['views/*.jade']
};

function runJshint() {
  return gulp.src(
      globs.js.lib.concat(
        globs.js.gulpfile.concat(globs.js.specs))
    )
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('jshint-growl-reporter'));
}

function mochaServer(options) {
  return gulp.src(globs.specs)
    .pipe(mocha(options || {
      reporter: 'nyan',
      growl: true
    }));
}

// function startServer() {
//     require('./bin/www');
//   }
  // Testing
var coverageOptions = {
  dir: './coverage',
  reporters: ['html', 'lcov', 'text-summary', 'html', 'json'],
  reportOpts: {
    dir: './coverage'
  }
};

gulp.task('jshint-build', function () {
  return runJshint().pipe(jshint.reporter('fail'));
});
gulp.task('jshint', function () {
  return runJshint();
});
// gulp.task('server', function () {
//   return startServer();
// });



gulp.task('mocha-server-continue', function (cb) {
  gulp.src(globs.js.lib)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('error', function (err) {
      console.log('istanbul error', err);
    })
    .on('finish', function () {
      mochaServer().on('error', function (err) {
          console.trace(err);
          this.emit('end');
          cb();
        }).pipe(istanbul.writeReports(coverageOptions))
        .on('end', cb);
    });
});
gulp.task('enforce-coverage', ['mocha-server'], function () {
  var options = {
    thresholds: {
      statements: 80,
      branches: 80,
      lines: 80,
      functions: 70
    },
    coverageDirectory: 'coverage',
    rootDirectory: process.cwd()
  };
  return gulp.src(globs.js.lib)
    .pipe(coverageEnforcer(options));
});
gulp.task('mocha-server', function (cb) {
  gulp.src(globs.js.lib)
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      mochaServer({
          reporter: 'spec'
        })
        .pipe(istanbul.writeReports(coverageOptions))
        .on('end', cb);
    });
});
gulp.task('nodemon', function () {
  nodemon({
    script: 'bin/www',
    ext: 'js html',
    ignore: ['node_modules', 'coverage'],
    env: {
      'NODE_ENV': 'development'
    }
  });
});

gulp.task('watch', function () {

  var watching = false;
  gulp.start(
    'jshint',
    'mocha-server-continue',
    function () {
      // Protect against this function being called twice
      if (!watching) {
        watching = true;
        gulp.watch(globs.js.lib.concat(
          globs.js.specs), ['seq-test']);
        gulp.watch(globs.js.Gulpfile, ['jshint']);
      }
    });
});
gulp.task('seq-test', function () {
  runSequence('jshint', 'mocha-server-continue');
});
gulp.task('test', function () {
  return gulp.start('jshint-build',
    'enforce-coverage');
});
gulp.task('build', function () {
  return gulp.start('jshint-build',
    'mocha-server',
    'enforce-coverage');
});
gulp.task('default', function () {
  return gulp.start(
    'nodemon',
    'jshint-build',
    'mocha-server-continue',
    'enforce-coverage');
});