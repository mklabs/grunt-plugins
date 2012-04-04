module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // viewer: 'stdout',

    lint: {
      files: ['grunt.js', 'lib/**/*.js', 'tasks/**/*.js']
    },
    test: {
      files: ['test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'lint test'
    },
    jshint: {
      options: '<json:.jshintrc>'
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

};
