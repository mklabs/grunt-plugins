module.exports = function(grunt) {

  //
  // Register each plugin in our grunt setup
  //

  // grunt help
  grunt.task.loadNpmTasks('grunt-help');

  // grunt impress
  grunt.task.loadNpmTasks('grunt-impress');

  // grunt fetch
  grunt.task.loadNpmTasks('grunt-fetch');

  // grunt less | https://github.com/jharding/grunt-less
  grunt.task.loadNpmTasks('grunt-less');

  // Default task.
  // My default task is the help one.
  grunt.registerTask('default', 'help');

};
