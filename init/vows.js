// mockup

var path = require('path');

module.exports = function(init, done) {

  // guess some defaults
  var pkg = file.findup('./', 'package.jsonnn'),
    name = pkg ? JSON.parse(file.read(pkg)).name : path.basename(process.cwd());

  // since name will be used to hold the pkg reference as js name,
  // so sanitize a little bit. basic, just splitting on cerain char, returning
  // first part
  name = name.split(/-|_|'/)[0];

  task.helper('prompt', [
    // Prompt for these values.
    task.helper('prompt_for', 'name', name),
    task.helper('prompt_for', 'filename', 'test.js'),
    task.helper('prompt_for', 'subject', 'The Deep Thought'),
    task.helper('prompt_for', 'context', 'An instance of DeepThought'),
    task.helper('prompt_for', 'vows', 'should know the answer to the ultimate question of life')
  ], function(err, props) {
    // Files to copy (and process).
    var files = [
      {src: 'test.js', dest: 'test/' + props.filename + (path.extname(props.filename) ? '' : '.js')}
    ];

    // Actually copy (and process). files.
    init.copyAndProcess(files, props);

    // All done!
    done();
  });
};
