# grunt-flavored

*Grunt with spicy API*

Experiments, fun, alternate grunt plugins exploration.

## Description

The idea here is to do some nasty things to your grunt object. Grunt
plugins which are under development, are already really great to package
tasks and helpers.

However, this tiny experiments goes a step further by **extending** the
grunt object, with some usefull (and spicy!) API.

This is mainly an experiment trying to load grunt tasks through node's
[VM](http://nodejs.org/api/vm.html) module, with a sandbox exposing
necessary part of the grunt api.

This ends up with something that really looks like grunt `v0.2.x`
using grunt `v0.3.x`. It's still not relying on globals but allows one
to write tasks as if it was, using the same syntax than in `v0.2.x`
(except from the api changes, eg. `registerBasicTask ->
registerMultiTask`, this should be updated in the task code directly).

In addition to this original VM loading experiment, I've added few more
stuff I wanted to play around like CoffeeScript task compilation,
tweaking (or overidding) the log object, `.use` method to augment grunt
with new functionnality, etc.

It's all about exploring the possibilities though, nothing too serious.

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
`task.loadNpmTasks`, see below for further details.

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
