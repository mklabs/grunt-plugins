# grunt-feature

Makes use of [gherkin](https://github.com/cucumber/gherkin) to author cucumber
like feature, and [Mocha](https://github.com/visionmedia/mocha) tests to run
associated steps.

Optionally, bundled as a grunt task.

### 1. Describe behaviour in plain text

```feature
Feature: Addition
  In order to avoid silly mistakes
  As a math idiot
  I want to be told the sum of two numbers

  Scenario: Add two numbers
    Given I have entered 50 into the calculator
    And I have entered 70 into the calculator
    Then the result should be 120 on the screen
```

### 2. Write a step definition in JS

```js
Given(/I have entered (.+) into the calculator/i, function(number, done) {
  this.calculator = this.calculator || new Calculator;
  this.calculator.push(number);
  done();
});

Then(/the result should be (.+) on the screen/i, function(result) {
  assert.equal(result, this.calculator.sum());
  done();
});
```

### 3. Run and watch it fail

```txt
Addition
  Add two numbers
    1) Given I have entered 50 into the calculator
    2) And I have entered 70 into the calculator
    3) Then the result should be 120 on the screen


✖ 3 of 3 tests failed:

1) Addition Add two numbers Given I have entered 50 into the calculator:
   ReferenceError: Calculator is not defined

2) Addition Add two numbers And I have entered 70 into the calculator:
   ReferenceError: Calculator is not defined

3) Addition Add two numbers Then the result should be 120 on the screen:
   TypeError: Cannot call method 'sum' of undefined
```

### 4. Write code to make the steps pass

```js
module.exports = Calculator;
function Calculator() {
  this.args = [];
}

Calculator.prototype.push = function(n) {
  this.args.push(typeof n === 'string' ? parseFloat(n) : n);
};

Calculator.prototype.sum = function() {
  return this.args.reduce(function(a, b) {
    return a + b;
  });
};
```

### 5. Repeat and see if it's green

```txt
Addition
  Add two numbers
    ✓ Given I have entered 50 into the calculator
    ✓ And I have entered 70 into the calculator
    ✓ Then the result should be 120 on the screen


✔ 3 tests complete (4ms)
```

## Documentation

The typical configuration for setting up features and steps to run with mocha
looks like the following:


```js
// grunt config
features: {
  examples: {
    features: ['examples/features/*.feature'],
    steps: ['examples/steps/**/*.js']
  }
}
```

### API

Direct usage of the runner is also possible:

```js
var feature = require('grunt-feature');

feature.run({
  steps: ['examples/steps/test.js', ...],
  features: ['examples/features/build.feature']
});

feature.on('end', function(failed) {
  console.log('Failed tests: ' + failed);
});
```


### Steps definition

Steps definitions can be registered using `Given`, `When`,  `Then` functions in
one of the `steps` loaded in configuration. These functions accepts all a
regular expression to match a step content and a callback function to invoke.

Functions are invoked as `Mocha.Test` handler, and are invoked in pretty much
the same way as an `it()` handler (for bdd interface). Scenario are registered
as `describe()` and indicates a new `Mocha.Suite`.

Every missing steps is registered to mocha as a pending test, and a
corresponding snippet is generated and displayed in the console for each one.

```js
  Addition
    Add two numbers
      - I have entered 50 into the calculator
      - I have entered 70 into the calculator
      - the result should be 120 on the screen


  ✔ 3 tests complete (2ms)
  • 3 tests pending

3 undefined steps

You can implement step definitions for missing steps with these snippets:

Given(/I have entered 50 into the calculator/i, function() {
  // step definition code goes here
});

Given(/I have entered 70 into the calculator/i, function() {
  // step definition code goes here
});

Then(/the result should be 120 on the screen/i, function() {
  // step definition code goes here
});
```
Steps can specify regexp placeholder, whose values can then be used within
steps callbacks. The last argument, if specified and not matching a captured
param, is considered as the Mocha asynchronous callback. Omitting it makes the
test synchronous.
