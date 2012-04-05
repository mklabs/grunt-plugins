
var fs = require('fs'),
  path = require('path'),
  npm = require('npm'),
  viewers = require('../lib/viewers');

var usage = [
  'Usage:',
  ' grunt help',
  ' grunt help:page'
];

module.exports = function(grunt) {

  var log = grunt.log,
    verbose = grunt.verbose;

  grunt.task.registerTask('helpr', 'Get help on grunt', function() {
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

