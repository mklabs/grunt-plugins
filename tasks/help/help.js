
var fs = require('fs'),
  path = require('path'),
  npm = require('npm'),
  viewers = require('./viewers');

//
// ### Help task - Get help on grunt task and API
//
// A significant amount of effort have been put into setting up a comprehensive
// and most excellent documentation on grunt usage, tasks and API.
//
//      https://github.com/cowboy/grunt/blob/master/docs/toc.md
//
// This task embraces this shiny new docs to provide an handy `grunt help`
// task. It takes term to search for in the grunt docs. A term should match a
// doc page, minus extension. Alternately, many term could be provided, such
// as `help:api:config` which is the equivalent of using `help:api_config`.
//
// **Configuration**
//
// In your gruntfile:
//
//    ...
//    viewer: 'man', // or browser, or stdout.
//    browser: 'open', // or google-chrome
//    ...
//
// If viewer or browser are not found in grunt config, then the npm config is used instead.
//
// Possible values for `viewer` are: man, browser or stdout.
//
//
// When `viewer=browser`, then the `browser` config value is used to open the
// appropriate HTML page in your browser.
//
// When `viewer=man`, then the documentation is displayed as manpage. The
// conversion is done directly from markdown files (in grunt installed
// location, either it is locally or globally), thanks to @kapouer's
// [ronnjs](https://github.com/kapouer/ronnjs#readme) and dipslayed via man
// executable.
//

var usage = [
  'Usage:',
  ' grunt help',
  ' grunt help:page'
];

module.exports = function(grunt) {

  var log = grunt.log,
    verbose = grunt.verbose;

  grunt.task.registerTask('help', 'Get help on grunt', function() {
    var cb = this.async(),
      term = Array.prototype.slice.call(arguments).join('_');

    resolve('grunt', function(err, gruntpath) {
      if(err) return cb(false);
      var docspath = path.join(gruntpath, 'docs'),
        docsfiles = fs.readdirSync(docspath);

      // guess the correct doc path from provided term
      var page = docsfiles.filter(function(f) {
        return path.basename(f) === term + path.extname(f);
      })[0];

      if(!page) {
        if(term) log.error('Unable to find documentation for ' + term);

        docsfiles = docsfiles.map(function(file) {
          return 'grunt help:' + file.replace(path.extname(file), '');
        });

        return log
          .writeln(usage.join(grunt.utils.linefeed))
          .writeln()
          .writeln(log.wordlist(['Pages:'].concat(docsfiles), grunt.utils.linefeed + ' » '));
      }

      // which viewer to use (only stdout now)
      var viewer = grunt.config('viewer') || npm.config.get('viewer');

      var view = viewers[viewer];
      if(!view) return log.error('not a valid viewer ' + viewer);

      var filepath = path.join(docspath, page);
      view.call(grunt, page, filepath, function(err) {
        if(err) {
          log.error(err);
          return cb(false);
        }
      });
    });
  });

  //
  // Set of helpers, not exposed as grunt helpers. But might be.
  //

  function resolve(name, cb) {
    npm.load({ global: true }, function(er) {
      if(er) return cb(er);
      try {
        cb(null, require.resolve(name));
      } catch(e) {
       // not installed locally, maybe in node prefix?
       fs.stat(path.join(npm.dir, name), function(er) {
         if(er) return cb(new Error(name + ' is not installed. Either it is locally or globally.'));
         cb(null, path.join(npm.dir, name));
       });
      }
    });
  }
};

