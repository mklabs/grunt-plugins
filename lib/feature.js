
var path = require('path'),
  events = require('events'),
  Feature = require('./feature/feature'),
  Mocha = require('mocha'),
  Suite = Mocha.Suite,
  Test = Mocha.Test;

var feature = module.exports = Object.create(events.EventEmitter.prototype);

// expose the Feature object
feature.Feature = Feature;

// holder for registered step definitions
feature.steps = [];

// top level entry
feature.run = function(options) {
  options = options || {};
  options.reporter = options.reporter || 'spec';

  var steps = options.steps || [],
    features = options.features || [];

  // holder for missing step definitions
  var missing = [];

  // initialize the mocha runner and top level suite
  var mocha = new Mocha(options);

  // register to pre-require hooks to attach Given, When, Then helpers globally
  // for steps definition to consume
  var mappings = feature.steps;
  mocha.suite.on('pre-require', function(context) {
    ['Given', 'When', 'Then'].forEach(function(keyword) {
      context[keyword] = function(regex, fn) {
        mappings.push({
          type: keyword,
          regex: regex,
          fn: fn
        });
      };
    });
  });

  // and create for each Feature / Step object
  // go through
  steps.forEach(feature.loadStep.bind(feature, mocha.suite));

  features.forEach(function(file) {
    var suites = [mocha.suite],
      last;

    new Feature(file)
      .on('feature', function(keyword, name, description, line) {
        var suite = Suite.create(suites[0], name);
        suites.unshift(suite);
      })
      .on('scenario', function(keyword, name, description, line) {
        last = Suite.create(suites[0], name);
      })
      .on('step', function(keyword, content, line) {
        var step = feature.findStep(keyword.trim(), content);
        missing.push({ keyword: keyword, content: content, missing: !step });
        if(!last) return;
        if(!step) return last.addTest(new Test(content));

        var tokens = content.match(step.regex);
        last.addTest(new Test(content, step.fn.bind.apply(step.fn, [last.ctx].concat(tokens.slice(1)))));
      })
      .scan();
  });

  mocha.run(function() {
    feature.printMissing(missing);
    feature.emit.apply(feature, ['end'].concat(Array.prototype.slice.call(arguments)));
  });

  return feature;
};

feature.loadStep = function loadStep(suite, file) {
  file = path.resolve(file);
  console.log('requiring file', file);
  suite.emit('pre-require', global, file);
  suite.emit('require', require(file), file);
  suite.emit('post-require', global, file);
};


feature.findStep = function findStep(keyword, content) {
  var and = keyword === 'And';
  return feature.steps.filter(function(step) {
    if(and) return step.regex.test(content);
    return step.type === keyword && step.regex.test(content);
  })[0];
};

feature.printMissing = function printMissing(missings) {
  var count = missings.filter(function(m) { return m.missing; });
  if(!count.length) return;

  console.log(count.length + ' undefined steps');
  console.log();
  console.log('You can implement step definitions for missing steps with these snippets:');
  console.log();

  missings.forEach(function(missing, i) {
    var keyword = missing.keyword,
      regex = missing.content;

    if(!missing.missing) return;

    keyword = /^And/.test(keyword) ? missings[i - 1].keyword : keyword;

    console.log([
      keyword.trim() + '(/' + regex + '/, function(done) {',
      '  // step definition code goes here',
      '});'
    ].join('\n'));

    console.log();

  });
};
