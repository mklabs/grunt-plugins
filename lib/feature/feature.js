
var fs = require('fs'),
  util = require('util'),
  events = require('events'),
  Lexer = require('gherkin').Lexer('en'),
  mocha = require('mocha'),
  Suite = mocha.Suite,
  Test = mocha.Test;

module.exports = Feature;

// list of events raised during the feature parsing
var hooks = [
  'comment',
  'tag',
  'feature',
  'background',
  'scenario',
  'scenario_outline',
  'examples',
  'step',
  'doc_string',
  'row',
  'eof'
];

function Feature(file) {
  events.EventEmitter.call(this);
  this.lexer = new Lexer(this);
  this.path = file;
}

util.inherits(Feature, events.EventEmitter);

Feature.prototype.scan = function scan() {
  this.lexer.scan(fs.readFileSync(this.path));
  return this;
};

hooks.forEach(function(hook) {
  Feature.prototype[hook] = function() {
    this.emit.apply(this, [hook].concat(Array.prototype.slice.call(arguments)));
    return this;
  };
});
