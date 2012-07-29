var assert = require('assert'),
  Calculator = require('../calculator');

Given(/I have entered (.+) into the calculator/i, function(number, done) {
  this.calculator = this.calculator || new Calculator;
  this.calculator.push(number);
  // mocha async handler is the last argument, if ommitted assumed to be
  // synchronous
  done();
});

Then(/the result should be (.+) on the screen/i, function(num) {
  assert.equal(num, this.calculator.sum());
});
