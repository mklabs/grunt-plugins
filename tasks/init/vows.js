// mockup

module.exports = function(init, done) {
  task.helper('prompt', [
    // Prompt for these values.
    task.helper('prompt_for', 'name'),
    task.helper('prompt_for', 'filename', 'test'),
    task.helper('prompt_for', 'subject', 'The Deep Thought'),
    task.helper('prompt_for', 'context', 'An instance of DeepThought'),
    task.helper('prompt_for', 'vows', 'should know the answer to the ultimate question of life')
  ], function(err, props) {
    // Files to copy (and process).
    var files = [
      {src: 'test.js', dest: 'test/' + props.filename + '.js'}
    ];

    console.log(props);
    // Actually copy (and process). files.
    init.copyAndProcess(files, props);

    // All done!
    done();
  });
};
