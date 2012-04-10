
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  _ = require('underscore'),
  stream = require('stream');

module.exports = Template;

var template = path.join(__dirname, '../templates/default/template.html'),
  defaults = fs.readFileSync(template, 'utf8');

// template
function Template(o) {
  o = o || {};
  this.readable = this.writable = true;
  this.chunks = [];
  // template content, this get replaced if a readable stream
  // is connected to this template object
  this.template = o.template ? path.resolve(o.template) : template;
  this.dirname = path.dirname(this.template);

  stream.Stream.call(stream);
  this.init(this.template);
}

util.inherits(Template, stream.Stream);
Template.prototype.init = function (template) {
  var self = this;
  if(template) return fs.readFile(template, 'utf8', function(err, body) {
    if(err) return self.emit('error', body);
    self.html = _.template(body);
    self.emit('ready');
  });

  // no template provided, we're ready
  this.html = _.template(defaults);
  process.nextTick(function() {
    self.emit('ready');
  });
};

Template.prototype.resume = function () {};

Template.prototype.write = function(chunk) {
  this.chunks = this.chunks.concat(chunk);
};

Template.prototype.end = function() {
  this.html = _.template(this.chunks.map(function(c) { return c + ''; }).join(' '));
  this.emit('end');
};

Template.prototype.render = function(data) {
  data = data || {};
  return this.html ? this.html(data) : '';
};

