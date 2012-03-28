# grunt-flavored

*Grunt with spicy API*

Experiments, fun, alternate grunt plugins exploration.

## Description

The idea here is to do some nasty things to your grunt object. Grunt
plugins which are under development, are already really great to package
tasks and helpers.

However, this tiny experiments goes a step further by **extending** the
grunt object, with some useful (and spicy!) API.

**Adds a few thing to the grunt api**

1. A [flatiron](github.com/flatiron/flatiron) like .use method. "like"
  cause it's far from being as good or elaborated as what it's done in
  flatiron (broadway actually)
2. A special load method, doing VM trickery to do cool things
3. (tbd) Example of overriding the log object
4. (tbd) Few more useful stuff

This is mainly an experiment trying to load grunt tasks through node's
[VM](http://nodejs.org/api/vm.html) module, with a sandbox exposing
necessary part of the grunt api.

This ends up with something that really looks like grunt `v0.2.x`
using grunt `v0.3.x`. It's still not relying on globals but allows one
to write tasks as if it was, using the same syntax than in `v0.2.x`
(except from the api changes, eg. `registerBasicTask ->
registerMultiTask, `, this should be updated in the task code directly).

In addition to this original VM loading experiment, I've added few more
stuff I wanted to play around like CoffeeScript task compilation,
tweaking (or overriding) the log object, `.use` method to augment grunt
with new functionnality, etc.

It's all about exploring the possibilities though, nothing too serious.

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

To gain access to this API, you need to get run it through the flavored
plugin.

```js
var flavored = require('grunt-flavored');

module.exports = function(grunt) {
  grunt = flavored(grunt);
  ...
};
```

### grunt.use

* `.use(fn, options)`

The use method is heavily inspired on
[flatiron](https://github.com/flatiron/flatiron) framework, and more
specifically [broadway](https://github.com/flatiron/broadway).

The idea is to to extend a given object, or application instance, with
new functionnality, in a composable manner.

    grunt.use(require('./some-plugin'));

The use method will "use" the given plugin definition which should
comply to the following interface:

```js
var plugin = module.exports;

// optional
plugin.name = 'plugin-name';

// synchronous method called immediately on `grunt.use(plugin);`
plugin.attach = function attach(options) {
  // get back a reference to the grunt object.
  var grunt = this;

  options = options || {};

  grunt.foobar = function() {
    grunt.log
      .writeln('  ^    ^    ^    ^    ^    ^  ')
      .writeln(' /F\  /o\  /o\  /b\  /a\  /r\ ')
      .writeln('<___><___><___><___><___><___>');
  };
};
```

One could think of extending a given object, or overriding it as long as
it provides the API expected by grunt.

### grunt.load

Loads tasks and helpers from the given directories, relative to grunt's
`base` option or `$cwd` by default.

* `grunt.load('./tasks')`
* `grunt.load(['./tasks', './another'])`

The load method allows you to load tasks, very much like the native
`grunt.loadTasks` method. 


If the tasks that are `require`-d are exposed in a way that is
compatible with `0.3.x` (eg. `module.export = function(grunt) { ...
};`), the load is done in the same way (`fn.call(grunt, grunt)`).

If the `require` call fails (yes it's hacky), then the module content is
read from disk and run through
[`vm.runInContext`](http://nodejs.org/docs/latest/api/vm.html#vm_vm_runincontext_code_context_filename)
and a very special sandbox:

```js
// Grunt utilities
sb.task = grunt.task;
sb.file = grunt.file;
sb.utils = grunt.utils;
sb.log = grunt.log;
sb.verbose = grunt.verbose;
sb.fail = grunt.fail;
sb.option = grunt.option;
sb.config = grunt.config;
sb.template = grunt.template;

// do the necessary api changes fallback? not strictly necessary, not sure if
// suitable. Probably doint this under some condition, depending on some prop
// in options maybe.
//
// registerBasicTask --> registerMultiTask

// common global stuff
sb.console = console;
sb.setTimeout = setTimeout;
sb.setInterval = setInterval;
sb.clearTimeout = clearTimeout;
sb.clearInterval = clearInterval;
sb.__filename = filename;
sb.__dirname = dirname;
sb.process = process;
sb.Buffer = Buffer;
```

Relative require statements should be correctly resolved.

This sandbox is the only global object the task will have access to, and
these tasks may define "global" stuff. They won't leak, and that's quite
cool.

This is an interresting way of loading grunt task, as it allows one to
write tasks like they used to be, with handy global hooks (but
potentially [harmful](https://github.com/cowboy/grunt/issues/12)) and
have them run through a safe "sandbox".

## Coffee Tasks

If `grunt.load` was called with a dir with some `.coffee` file in it,
they'll be compiled to JavaScript before running in the VM sandbox, so
the following should be valid:

**test/grunt/tasks/test.coffee**

```cs
task.registerMultiTask 'coffee-logstuff', 'This task logs stuff.', ->
  log.writeln @target + ': ' + @data
  assert.ok @target
  assert.ok @data
  assert.ok @name
  assert.ok @args
  assert.ok @flags
  assert.ok @file
  return false  unless @data
  log.writeln 'Logging stuff succeeded.'
```

is the equivalent of [Multi task example in grunt's docs](https://github.com/cowboy/grunt/blob/master/docs/types_of_tasks.md).

## Example

Writing plugins is quite straightforward, plugins needs to expose a
`name` (optionally, if undefined one will be generated) and a
synchronous `attach` handler.

At some point, this may ends up to use flatiron directly (or maybe just
broadway).

* **load** the load method is defined through a plugin, it's probably a
  good example to figure out how it works.

* **log** Example of overriding grunt's log object. This should
  comply to grunt's [log api](https://github.com/cowboy/grunt/blob/master/docs/api_log.md).

The log plugin example can be found in example.

**Run it!**

    $ cd examples
    $ grunt

☃ party.

    ☃  - Running "logstuff:foo" (logstuff) task
    ☃  - foo: 1,2,3
    ☃  - foo
    ☃  - 1,2,3
    ☃  - logstuff
    ☃  - 
    {}
      data -{ src: [ 1, 2, 3 ],
      data -  dest: 'foo' }
    ☃  - Logging stuff succeeded.

    ☃  - Running "logstuff:bar" (logstuff) task
    ☃  - bar: hello world
    ☃  - bar
    ☃  - hello world
    ☃  - logstuff
    ☃  - 
    {}
      data -{ src: 'hello world', dest: 'bar' }
    ☃  - Logging stuff succeeded.

    ☃  - Done, without errors.

## Todo

* show loaded tasks with `--help` output (might be related [#83](https://github.com/cowboy/grunt/issues/83))

## Tests

Simply run

    npm test

It'll do some basic assertion tests and launch grunt to run the few
defines tasks that can be found in `test/grunt/tasks`

