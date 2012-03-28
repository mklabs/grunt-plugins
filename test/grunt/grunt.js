
var flavored = require('../../');

module.exports = function(grunt) {

  grunt = flavored(grunt);

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    jshint: {
      options: '<json:.jshintrc>'
    },
    logstuff: {
      foo: [1, 2, 3],
      bar: 'hello world'
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint');

  // load task, with the special VM load method
  grunt.load('tasks');

};
