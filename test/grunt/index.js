var assert = require('assert'),
  resolve = require('path').resolve,
  spawn = require('child_process').spawn;

module.exports = function grunt(cmd) {
  var stack = grunt.stack || (grunt.stack = []);
  stack.push(cmd);

  process.nextTick(function() {
    if(grunt.started) return;
    grunt.started = true;

    // path to the grunt executable, going to node dependency but could be done
    // with the global grunt instead
    var gruntpath = resolve('node_modules/grunt/bin/grunt');

    // now that the stack is setup, run each command serially
    (function run(cmd) {
      if(!cmd) return;
      // grunt process
      var gpr = spawn(gruntpath, cmd.split(' '), { cwd: resolve('test/grunt') });
      gpr.stdout.pipe(process.stdout);
      gpr.stderr.pipe(process.stderr);

      gpr.on('exit', function(code) {
        assert.equal(code, 0, ' ✗ Grunt exited with errors. Code: ' + code);
        run(stack.shift());
      });
    })(stack.shift());
  });
}

