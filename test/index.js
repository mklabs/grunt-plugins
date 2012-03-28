
//
// Basic assertions tests - no framework
//

var assert = require('assert'),
  run = require('./grunt'),
  gf = require('../');

var flavored = gf();

assert.ok(gf);
assert.ok(typeof gf === 'function');

assert.ok(flavored);

// use api
assert.ok(typeof flavored.use === 'function');

// load api
assert.ok(typeof flavored.load === 'function');

// log api
// assert.ok(flavored.log.name);


//
// spawning grunt with real test case, executing the tasks in `test/grunt/tasks`
//


['logstuff', 'flavored-test', 'foo'].forEach(run);


// coffee script written tasks
['coffee-logstuff', 'coffee-flavored', 'coffee-foo'].forEach(run);

