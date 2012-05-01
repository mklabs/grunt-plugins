var path = require('path');

module.exports = function(grunt) {

  //
  // Register each plugin in our grunt setup
  //
  // grunt help
  // grunt impress
  // grunt fetch
  // grunt less | https://github.com/jharding/grunt-less
  //

  // the node_modules prefix
  var nm = path.join(__dirname, '../node_modules');

  // plugins from package.json file
  var plugins = Object.keys(require('../package.json').dependencies);

  // load them up!
  plugins.forEach(function(plugin) {
    grunt.loadTasks(path.join(nm, plugin, 'tasks'));
  });

};
