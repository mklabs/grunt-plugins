
var assert = require('assert');

task.registerTask('flavored-test', 'Dummy task, testing things', function() {
  log
    .writeln('Testing things with something')
    .writeln('that looks like grunt 0.2.x api')
    .writeln('But no.. This is grunt 0.3.5');
});

task.registerMultiTask('logstuff', 'This task logs stuff.', function() {
  // this.target === the name of the target
  // this.data === the target's value in the config object
  // this.name === the task name
  // this.args === an array of args specified after the target on the command-line
  // this.flags === a map of flags specified after the target on the command-line
  // this.file === file-specific .src and .dest properties

  // Log some stuff.
  log.writeln(this.target + ': ' + this.data);

  assert.ok(this.target);
  assert.ok(this.data);
  assert.ok(this.name);
  assert.ok(this.args);
  assert.ok(this.flags);
  assert.ok(this.file);

  // If data was falsy, abort!!
  if (!this.data) { return false; }
  log.writeln('Logging stuff succeeded.');
});

