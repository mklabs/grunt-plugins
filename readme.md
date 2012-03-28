# grunt-flavored

*Grunt with spicy API*

Experiments, fun, alternate grunt plugins exploration.

## Description

The idea here is to do some nasty things to your grunt object. Grunt
plugins which are under development, are already really great to package
tasks and helpers.

However, this tiny experiments goes a step further by **extending** the
grunt object, with some usefull (and spicy!) API.

**Adds a few thing to the grunt api**

1. A flatiron like .use method. "like" cause it's far from being as good
  or elaborated as what it's done in flatiron (broadway actually)
2. A special load method, doing VM trickery to do cool things:
3. (tbd) Example of overriding the log object
4. (tbd) Few more useful stuff

## Disclaimer

Be warn. This plugin is not a "real" grunt plugin in the way that it
doens't provides additionnal tasks, but an extended api, directly on the
`grunt` object.

As such, its usage differs from typical grunt plugins with
`task.loadNpmTasks`, see below for furhter details.

## Getting Started

Add this plugin as a project dependency: `npm install grunt-flavored -S`

Then add this to your project's `grunt.js` gruntfile:

```javascript
var flavored = require('grunt-flavored');

module.exports = function(grunt) {
  grunt = flavored(grunt);

  // usual grunt config, loadTask, etc.

  // use the new API
  grunt.use(require('./some-plugin'));

  // alternate loading task methods
  grunt.load('./tasks');
}
```

## Documentation

> to do

## Tests

Simply run

    npm test

It'll do some basic assertion tests and launch grunt to run the few
defines tasks that can be found in `test/grunt/tasks`
