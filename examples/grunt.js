
var flavored = require('../');

module.exports = function(grunt) {

  grunt = flavored(grunt);

  // Project configuration.
  grunt.initConfig({
    logstuff: {
      foo: [1, 2, 3],
      bar: 'hello world'
    }
  });

  // Default task.
  grunt.registerTask('default', 'logstuff');

  // extend grunt with the new Logger
  grunt.use(require('./logger'));
  //
  // load task, with the special VM load method
  // some may be written in CS
  grunt.load('tasks');
};
