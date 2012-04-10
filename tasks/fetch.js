
var fetch = require('../'),
  path = require('path');


module.exports = function(grunt) {

  grunt.registerTask('fetch', 'Your task description goes here.', function(repo, branch) {
    var cb = this.async();
    if(!repo) {
      grunt.log.error('You must provide a valid repository (grunt fetch:user/repo)');
      return cb(false);
    }

    branch = branch || 'master';

    // tarball url to fetch
    var tarball = 'http://nodeload.github.com/' + repo + '/tarball/' + branch;

    // install location, should map a directory. If the dir does not exists, fstream will handle
    // that for us.
    var where = grunt.config('fetch.location') || grunt.option('fetch.location') ||
        grunt.option('to') || path.resolve(repo);

    grunt.log
      .subhead('Fetching ' + tarball)
      .writeln('into ' + where)
      .writeln('This might take a few moment');

    var req = fetch.call(grunt, tarball, where, function(err) {
      if(err) {
        grunt.log.error(err);
        return cb(false);
      }

      console.log('All done');
    });

  });

  grunt.registerHelper('fetch', function() {
    return 'fetch!!!';
  });

};
