

### grunt stream

My favorite API from node is [Stream][], and `grunt-stream` is a grunt plugin
allowing you to register an additional type of task, stream-based.

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
[Stream]: http://nodejs.org/api/stream.html
[Streams]: http://nodejs.org/api/stream.html
[fs.WriteStream]: http://nodejs.org/api/fs.html#fs_fs_writestream
[fs.ReadStream]: http://nodejs.org/api/fs.html#fs_class_fs_readstream
[process.stdin]: http://nodejs.org/api/process.html#process_process_stdin
[Readable Stream]: http://nodejs.org/api/stream.html#stream_readable_stream
[Writable Stream]: http://nodejs.org/api/stream.html#stream_writable_stream
[http.ClientResponse]: http://nodejs.org/api/http.html#http_http_clientresponse


## Getting Started

Install this grunt plugin next to your project's [grunt.js
gruntfile][getting_started] with: `npm install grunt-stream -s`

Then configure your project's `Gruntfile.js` Gruntfile like so:

```js
var gstream = require('grunt-stream');

module.exports = function(grunt) {

  // Project configuration
  grunt.initConfig({
    ...
  });

  // init gstream and register your grunt instance
  gstream.init(grunt);

  // load your tasks, like you usually would
  grunt.loadTasks('./tasks');
};
```

Then, you can use `gstream.registerTask` (or `gstream.task`) in any of your task
file.

##### Stream tasks

Stream tasks usually takes input from stdin and output stuff to stdout. Stream
tasks can used in a very unix-friendly way. It allows you to do things like
this:

```sh
$ grunt cat lib/*.js | grunt min > mylib.min.js
```

It's quite flexible you can run a set of tasks, like you usually would, add a
steam task at the end of your series of grunt task, and then pipe the result to
another process, grunt stream task or redirect the output to another file.

```sh
 $ grunt intro build stream-task --no-color | grunt report >> build.txt
 ```

##### API

Once gstream have been init'd with `grunt`, you can safely use the
`gstream.task` API.

**init** This is usually done in your project's Gruntfile, and done once.

    gstream.init(grunt);

**registerTask** define a new stream-based task.

    gstream.registerTask('ilovestreams', 'Shows your stream love', function() {

    });

The API tries to be as close as possible than the grunt one, and
`grunt.registerTask` is mostly a typical `grunt.registerTask` (not a multi task)
with some streaming ability.

They take arguments if they were passed from cli: `grunt ilovestreams:foo:bar`,
and have the usualy task object attached as function context:

    this.requires
    this.requiresConfig
    this.name
    this.nameArgs
    this.args
    this.flags
    this.errorCount

Actually, the object you get in task function with `this` is an instance of
[Stream][] with these values attached to stream instance. So you can also use
the Stream API, you'll also gain `.on` and `.emit` from EventEmitter API.

Streams are readable / writable.

Streams must go asynchronous, they simply can't be synchronous so `this.async()`
is automatically enabled for you, and a special `this.done` callback is made
available. This callback must be called when the task is done (Alternately, you
can use the EventEmitter api by emitting an `end` or `done` event).

They have the folllowing properties attached, wich are not part of grunt api:

    this.intput -> stdin (or w/e) incoming stream
    this.output -> stdout (or w/e) outgoing stream

### How it workds

Stream task follows the following convention:

* each task take an incoming stream
* each task should write to the outgoing stream

Streams are awesome, they really are. Streams can be of any type, either is a
[fs.ReadStream][] or [fs.WriteStream][], a [Readable Stream] for [process.stdin],
a [Writable Stream][] for process.stdout, an [http.clientResponse][], etc.

A simple pass thru stream could be written like so:

```js
gstream.registerTask('logthings', 'Logs "." for each incoming data chunk', function() {
  this.output.on('data', function() { grunt.log.write('.'); })
  this.input.pipe(this.output);
});
````

In this case, you don't need to manually call the `done` callback explicitly,
since the outgoing stream (`this.output`) will emit an `end` event when the pipe
has completed.

Actually, calling `this.done()` or emitting an `end` or `done` event on the task
context will internally emit the appropriate event on the outgoing stream
`this.output`. Tasks are considered complete when the outgoing stream has been
ended (`this.output.end()`).


### Examples

> todo
