var mocha = require('mocha');

module.exports = function(grunt) {

  var util = grunt.util || grunt.utils;
  grunt.registerMultiTask('mocha', 'Run Mocha unit tests', function() {
    // provide a fallback to this.options() method if not defined (grunt
    // version lower than 0.4)
    this.options = this.options || grunt.helper('opts', this);
    if(this.target === 'options') return;

    var data = this.options();

  });

  // fallback mechanism to this.options() method in task
  // Return an options object with the specified defaults overriden by task-
  // and/or target-specific overrides, via the "options" property.
  grunt.registerHelper('opts', function(ctx) {
    var name = ctx.name,
      target = ctx.target;

    return function() {
      var args = [{}].concat(util.toArray(arguments)).concat([
        grunt.config([name, 'options']),
        grunt.config([name, target, 'options'])
      ]);
      return util._.extend.apply(null, args);
    };
  });

};
