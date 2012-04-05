module.exports = function(grunt) {

  // Project configuration.
  //
  // If either viewer or browser are not set in grunt config, then npm config
  // values are used.
  //
  //    npm config get viewer
  //    npm config set viewer browser
  //
  //    npm config get browser
  //    npm config set browser google-chrome
  //
  grunt.initConfig({
    // or stdout / browser
    viewer: 'man',

    // the command used to open websites
    browser: 'open'
  });

  // Default task.
  grunt.registerTask('default', 'help');

};
