
var npm = require('npm'),
  path = require('path');

var home = process.env.platform === 'win32' ? process.env.USERPROFILE : process.env.HOME;

module.exports = function(grunt) {

  grunt.task.registerInitTask('install', 'Install an npm package right into your ~/.grunt directory', function() {
    var cb = this.async(),
      args = Array.prototype.slice.call(arguments);

    npm.load(grunt.config('npm'), function(err) {
      if(err) return grunt.fail.warn(err, 3);

      if(!args.length) {
        grunt.log.error('One or more packages to install must be specified. Valid commands are: ' + grunt.log.wordlist([
          '', '',
          'grunt install:packagename',
          'grunt install:firstpackage:secondpackage'
        ], '\n'));

        return cb(false);
      }

      grunt.verbose.or.writeln('Install ' + args.join(' ') + '...');
      npm.commands.install(path.resolve(home, '.grunt'), args, function(err) {
        if(err) {
          grunt.verbose.or.error(err.stack || err);
          return grunt.fail.warn(err, 3);
        }

        grunt.verbose.or.ok();
        cb();
      });
    });
  });

};

