module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // mocha is a multi-task, you can defined target specific options. These
    // options maps mocha ones.
    //
    // For each target, specify a `src` Array of glob patterns.
    mocha: {
      options: {
        reporter: 'spec'
      },

      plugin: {
        src: ['test/*.js'],
        options: {
          reporter: 'nyan',
          timeout: 2000
        }
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'mocha');

};
