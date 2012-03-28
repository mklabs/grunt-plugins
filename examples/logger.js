
var inspect = require('util').inspect;

var plugin = module.exports;

// Give it a name, if not one will be generated automatically
plugin.name = 'fancy-logger';

plugin.attach = function attach() {
  var grunt = this;

  // store a reference to the native grunt logger
  var writeln = grunt.log.writeln;

  // Example: Adds a fancy ☃ to all writeln calls
  grunt.log.writeln = function() {
    arguments[0] = '☃  - ' + arguments[0];
    return writeln.apply(grunt.log, arguments)
  };


  // handy inspect method
  grunt.log.inspect = function(o, prefix) {
    prefix = prefix || '';
    var out = inspect(o, false, 4, true).split('\n').map(function(line) {
      return !!line ? prefix + line : line;
    }).join('\n');
    process.stdout.write(out  + '\n');
  };


  grunt.log.data = function(o) {
    grunt.log.inspect(o, '  data -');
  };
};

