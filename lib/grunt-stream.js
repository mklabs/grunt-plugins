

var gstream = module.exports;

//
// Init gstream with given grunt instance
//

gstream.init = function init(grunt, opts) {
  if(!grunt) throw new Error('You must pass a grunt object');
  this.grunt = grunt;
  this.options = opts;
  return this;
};

gstream.registerTask = function registerTask(name, description, handler) {
  this.grunt.registerTask(name, description, function() {
    var prev = gstream._running;
    handler.apply(gstream._running = new TaskStream(this, prev), arguments)
  });
  return this;
};

// Task TaskStream

var util = require('util'),
  Stream = require('stream').Stream;

function TaskStream(task, prev) {
  this.readable = this.writable = true;
  Stream.call(this);

  // configure task environment
  this.configure(task);

  var self = this;

  // set streams
  this.input = new InputStream;
  this.output = new OutputStream;

  this.input.name = self.name;
  this.output.name = self.name;

  // if output has ended and have chunks, re-emit each one
  if(prev && prev.output._ended) prev.output.chunks.forEach(function(c) {
    process.nextTick(function() {
      self.input.emit('data', c);
    });
  });

  this.output.on('end', this.done);
}

util.inherits(TaskStream, Stream);

TaskStream.prototype.configure = function(task) {
  var self = this;

  // hoist-up any prop from task object
  Object.keys(task).forEach(function(key) {
    if(self[key] == null) self[key] = task[key];
  });

  // configure async behaviour
  var done = this.done = this.async();
  this.on('error', function(err) {
    // just log them for now and tell grunt something went wrong
    console.log(err);
    done(false);
  });
};

// stream api

TaskStream.prototype.write = function(chunk) {
  this.emit('data', chunk);
};

TaskStream.prototype.end = function(chunk) {};

// Input Stream

function InputStream(task, prev) {
  this.readable = true;
  Stream.call(this);
}

util.inherits(InputStream, Stream);

// Output Stream

function OutputStream(task, prev) {
  this.writable = true;
  this.chunks = [];
  InputStream.call(this);
}

util.inherits(OutputStream, InputStream);

OutputStream.prototype.write = function(chunk) {
  this.chunks = this.chunks.concat(chunk);
  this.emit('data', chunk);
};

OutputStream.prototype.end = function() {
  this._ended = true;
  this.emit('end');
  this.emit('close');
};

OutputStream.prototype.destroy = function() {};
