module.exports = function(grunt) {

  // Register each plugin in our grunt setup

  grunt.task.loadNpmTasks('grunt-help');

  // Default task.
  // My default task is the help one.
  grunt.registerTask('default', 'help');

};
