/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    features: {
      examples: {
        features: ['examples/features/*.feature'],
        steps: ['examples/steps/**/*.js']
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint test');

  grunt.loadTasks('tasks');

};
