
// Module dependencies

var path = require('path');


module.exports = gruntConfig;

gruntConfig.Template = require('./lib/template');
gruntConfig.Install = require('./lib/install');


function gruntConfig(grunt) {

  // Project configuration.
  grunt.initConfig({
    lint: {
      files: ['grunt.js', 'tasks/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: '<config:lint.files>',
      tasks: 'default'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        node: true,
        es5: true
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks(path.join(__dirname, 'tasks'));

  // Default task.
  grunt.registerTask('default', 'template:help');

}
