
var util = require('util'),
  events = require('events');

module.exports = Step;

// individual step
function Step(file) {
  events.EventEmitter.call(this);
  this.path = file;
  this.step = require(this.path);
}

util.inherits(Step, events.EventEmitter);

