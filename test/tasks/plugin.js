
var fs = require('fs'),
  gstream = require('../../');


module.exports = function(grunt) {

  gstream.registerTask('tstream', 'Test streaming ability ', function() {
    var self = this;
    setTimeout(function() {
      grunt.log.write(grunt.helper('plugin'));
      self.emit('end');
    }, 2000);
  });

  gstream.registerTask('cat', 'Cat things', function() {
    fs.createReadStream('./grunt.js').pipe(this.output);
  });

  gstream.registerTask('logthings', 'Logs "." for each incoming data chunk', function() {
    this.input.on('data', function(c) { grunt.log.write('WOOOOOOOOOT'); });
    this.input.pipe(process.stdout);
  });

  grunt.registerTask('foo', 'Test things', function() {
    grunt.log.write(grunt.helper('plugin'));
  });

  grunt.registerHelper('plugin', function() {
    return 'plugin!!!';
  });

};
