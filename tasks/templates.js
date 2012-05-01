/*
 * grunt-templates
 * https://github.com/mk/grunt-templates
 *
 * Copyright (c) 2012 Mickael Daniel
 * Licensed under the MIT license.
 */

var Template = require('../').Template;

module.exports = function(grunt) {

  grunt.registerTask('template', 'template for lazy people, template:help for further info', function(action) {
    // async task
    var cb = this.async();
    var template = new Template(action);

    template.on('repo', function(repo) {
      var r = grunt.log.wordlist([repo.name, repo.repo, repo.branch], '/');
      grunt.log.writeln('Initializing template with repo ' + r);
    });

    template.on('end', function() {
      cb();
    });
  });
};
