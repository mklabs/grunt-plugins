
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  mime = require('mime'),
  marked = require('marked'),
  stream = require('stream'),
  Template = require('./template'),
  highlight = require('highlight.js').highlightAuto;

module.exports = Impress;
Impress.Template = Template;


// converter - takes a raw markdown content, pass it through
// [marked](https://github.com/chjj/marked), builds a list of sections
// delimited by level-1 heading

function Impress(body, o) {
  var self = this;
  this.readable = this.writable = true;

  this.options = o || (o = {});
  o.generate = o.generate == null ? true : o.generate;

  this.body = body;
  this.tokens = marked.lexer(body);

  this._sections = [];
  this.chunks = [];
  this.data = {
    name: '',
    page: 0
  };

  stream.Stream.call(this);

  this.once('ready', this.generate.bind(self));

  // read the template file if provided
  this.template = new Template(o)
    .on('ready', this.emit.bind(this, 'ready'));
}

util.inherits(Impress, stream.Stream);

Impress.prototype.generate = function() {
  this
    // build the section list
    .sections()

    // highlight snippet of code
    .highlight()

    // compute the html
    .html()

    // print to stdout
    .output();
};

Impress.prototype.sections = function(tokens) {
  var self = this;

  tokens = tokens || this.tokens;

  // the section list to build
  var sections = this._sections;

  // the data object holder passed in to template
  var data = {};

  var last = {};
  tokens.forEach(function(t) {
    var heading = t.type === 'heading' || t.type === 'hr',
      level = t.depth;

    // a heading (or hr), create a new sections, and update the last ref
    if(heading) {
      sections = sections.concat(last = {
        title: t.text,
        tokens: [],
        attributes: self.attributes(last)
      });
      data.page++;
    }
    last && last.tokens && last.tokens.push(t);
  });

  this._sections = sections;
  this.data = data;

  return this;
};

Impress.prototype.attributes = function(last) {
  var attrs = last.attributes || {},
    x = attrs.x,
    y = attrs.y,
    z = attrs.z;

  return {
    x       : x ? x + 1050 : 1,
    y       : y || -1000,
    z       : z,
    rx      : 0,
    ry      : 0,
    rz      : 0,
    scale   : 1
  };
};

Impress.prototype.highlight = function() {
  this.tokens = this.tokens.map(function(t) {
    if(t.type === 'code') {
      t.text = highlight(t.text).value;
      t.escaped = true;
    }
  });

  return this;
};

var link = /<link.+href="([^"]+)".+\/?>/gm,
  img = /<img.+src="([^"]+)".+\/?>/gm;

Impress.prototype.assets = function(html) {
  var links = html.match(link) || [],
    scripts = html.match(scripts) || []

  /* * /
  var base = this.template.dirname;
  html = html.replace(link, function(match, href) {
    if(/\/\//.test(href)) return match;
    var filepath = path.join(base, href),
        file = fs.readFileSync(filepath, 'utf8');
    return '<style>\n' + file + '\n</style>';
  });

  html = html.replace(img, function(match, src) {
    var ext = /\/\//.test(src);
    return base64img(ext ? '' : src);
  });
  /* */

  return html;
};

Impress.prototype.html = function() {
  var self = this;
  this._sections.forEach(function(section, i) {
    section.html = marked.parser(section.tokens);

    var attrs = section.attributes;
    section.attributes = [
      'data-x="$x" data-y="$y" data-z="$z" data-rotate-x="$rx"',
      'data-rotate-y="$ry" data-rotate-z="$rz" data-scale="$scale"'
    ].join(' ')
      .replace('$x', attrs.x)
      .replace('$y', attrs.y)
      .replace('$z', attrs.z)
      .replace('$rx', attrs.rx)
      .replace('$ry', attrs.ry)
      .replace('$rz', attrs.rz)
      .replace('$scale', attrs.scale);

    self.chunks = self.chunks.concat(new Buffer(section.html));
  });
  return this;
};

Impress.prototype.output = function() {
  var output = this.assets(this.template.render({ sections: this._sections }));
  this.emit('data', output);
  return this;
};

function base64img(file) {
  var media = mime.lookup(file),
    body = file ? fs.readFileSync(file, 'base64') : '$base64';

  return '<img src="data:$media;base64,$base64"/>'
    .replace('$media', media)
    .replace('$base64', body)
}
