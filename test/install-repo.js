//
// Mocha generated tests
//

// Module dependencies

var fs = require('fs'),
  path = require('path'),
  spawn = require('child_process').spawn,
  mkdirp = require('mkdirp'),
  rimraf = require('rimraf');

var script = path.join(__dirname, '../bin/grunt-templates');

// test directory
var testdir = path.join(__dirname, '.test');

describe("Install repo", function() {

  beforeEach(function(cb) {
    mkdirp(testdir, cb);
  });

  afterEach(function(cb) {
    rimraf(testdir, cb);
  });


  describe("As a lazy developper I want to fetch a given repo So that I can start right away", function() {

    describe("grunt-template h5bp/html5-boilerplate", function() {

      it("Given I run 'grunt-template h5bp/html5-boilerplate'", function(cb) {
        run('grunt-templates h5bp/html5-boilerplate', cb);
      });

      it("And I answer to a bunch of prompt");

      it("When the 'end' event is triggered");

      it("Then the outcome should be 'test/fixtures/h5bp'");

    });

  });
});

// todo: export as helper case of multiple test
function run(args, cb) {
  args = Array.isArray(args) ? args.join(' ') : args;
  args = args.split(' ');
  var cmd = args.shift();
  var ch = spawn(cmd, args, {
    cwd: testdir
  });

  ch.stdout.pipe(process.stdout);
  ch.stderr.pipe(process.stdout);
  ch.on('exit', function(code) {
    if(!code) return cb();
    cb(new Error('Error executing' + cmd + args.join(' ') + '. Code:' + code));
  });

  return ch;
}
