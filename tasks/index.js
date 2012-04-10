var fs = require('fs'),
  path = require('path'),
  Impress = require('../');

module.exports = function(grunt) {

  var silent = grunt.option('silent');

  // hijack the logging from grunt, cause we might pipe the output to
  // other process or directly to a file
  if(grunt.cli.tasks[0] === 'impress') {
    grunt.log.writeln =
    grunt.log.subhead = function() { return grunt.log; };
  }

  grunt.registerTask('impress', 'Reads a markdown, Generates a basic impress.js presentation', function(arg) {
    var cb = this.async();
    if(arg === 'help') return fs.createReadStream(path.join(__dirname, '../readme.md')).pipe(process.stdout);

    var options = grunt.cli.options;

    // basic timed out thing, handle times where stdin has no data to consume
    var to = setTimeout(cb, 250);

    // collect stdin, this works for simple utf8 file
    var stdin = process.openStdin();
    stdin.setEncoding('utf8');
    var text = '';
    stdin.on('data', function(chunk){
      text += chunk;
    });
    stdin.on('end', function() {
      clearTimeout(to);
      var impress = new Impress(text, options).on('end', cb);
      impress.on('error', function(err) {
        grunt.log.error(err);
        cb(false);
      });

      impress.pipe(process.stdout);
    });
  });
};

