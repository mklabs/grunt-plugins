
var fs = require('fs'),
  path = require('path');

var github = module.exports;

// Basic template description.
github.description = 'Init a new project, based on a github repository';

// Any existing file or directory matching this wildcard will cause a warning.
github.warnOn = '*';

// The actual init template.
github.template = function(grunt, init, done) {

  // dummy empty props for now
  var props = {};

  // Files to copy (and process).
  var files = init.filesToCopy(props);

  // Actually copy (and process) files.
  init.copyAndProcess(files, props);

  // All done!
  done();
};


// **renames** wrapper to grunt's rename feature, dealing with specific
// directory mappings.
github.renames = function(init, props) {
  var files = props.files || {},
    grunt = this.grunt,
    root = path.join(__dirname, 'github/root/');

  Object.keys(files).forEach(function(file) {
    var dest = files[file],
      ignores = ['none', 'nill', 'nil', 'false', 'null'],
      falsy = !!~ignores.indexOf(dest);

    // handle our ignores values
    if(falsy) files[file] = false;

    // handle directory like name
    if(file.slice(-1) === '/') {
      grunt.file.expandFiles({ dot: true }, path.join(root, file, '**')).forEach(function(filepath) {
        filepath = filepath.replace(root, '').replace(/^(\/)|(\\)/g);
        var dest = files[file];
        dest = dest.slice(-1) === '/' ? dest : dest + '/';
        files[filepath] = filepath.replace(file, dest);
      });
    }
  });

  return this.grunt.utils._.extend({}, init.renames, files);
};

