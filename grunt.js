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
    }
  });

  // help plugin
  // grunt.task.loadNpmTasks('grunt-help');

  // Default task.
  grunt.registerTask('default', 'init');

};
