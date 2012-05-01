
// Check if we're behind some kind of proxy.
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
    process.env.https_proxy || process.env.HTTPS_PROXY || '';

// module dependencies
var parse = require('url').parse,
  request = require('request').defaults({ proxy: proxy }),
  stream = require('stream'),
  util = require('util');

module.exports = req;

function req(uri, options, callback) {
  if (typeof uri === 'undefined') throw new Error('undefined is not a valid uri or options object.');
  if ((typeof options === 'function') && !callback) callback = options;
  if (typeof options === 'object') {
    options.uri = uri;
  } else if (typeof uri === 'string') {
    options = { uri: uri };
  } else {
    options = uri;
  }

  if (callback) options.callback = callback;

  var fallback = proxy && /^https/.test(options.uri || options.url);
  return fallback ? apiFallback(options) : request(options);
}


//
// Fallback to a few more request step only when behind a proxy, and requesting
// an https url. This does the necessary conversion to:
//
//  1. Guess the correct api v2 url to get raw content
//  (user / repo / branch / subpath)
//  2. Figure out the latest sha1, list all blobs, get the sha1 for particular file
//  (List all blobs: https://github.com/api/v2/json/blob/all/h5bp/html5-boilerplate/master)
//  3. Do a request to this file, get back to raw content
//  (https://github.com/api/v2/json/blob/show/h5bp/html5-boilerplate/72be02a5cb6ccdbdf3ff22d0c5ffcf2c188f72ff)
//  4. Pipe it through the stream destination
//  5. Success
//

var matcher = /https\:\/\/raw.github.com\/([^\/]+)\/([^\/]+)\/([^\/]+)\/([^\/]+)\/?/;

function apiFallback(options) {
  var url = options.uri || options.url;

  //  1. Guess the correct api v2 url to get raw content
  //  > user / repo / branch / subpath
  // parse info from url
  var match = url.match(matcher) || [],
    name = match[1],
    repo = match[2],
    branch = match[3],
    subpath = match[4];

  return new GhRequest({
    name: name,
    repo: repo,
    branch: branch,
    path: subpath
  });
}

function GhRequest (options) {
  this.options = options;
  this.name = options.name;
  this.repo = options.repo;
  this.path = options.path;
  this.branch = options.branch;

  stream.Stream.call(this);
  this.init();
}

util.inherits(GhRequest, stream.Stream);

GhRequest.prototype.urls = {
  blobs: 'http://github.com/api/v2/json/blob/all/:name/:repo/:branch',
  raw: 'http://github.com/api/v2/json/blob/show/:name/:repo/:sha1'
};

GhRequest.prototype.url = function(type, data) {
  if(!this.urls[type]) return this.emit('error', new Error('wrong type'));
  var uri = this.urls[type];

  return uri.replace(/:([^\/]+)/g, function(param) {
    var p = param.slice(1);
    return data[p] ? data[p] : param;
  });
};

GhRequest.prototype.init = function() {
  var url = this.url('blobs', this);

  var self = this;

  //  2. Figure out the latest sha1, list all blobs, get the sha1 for particular file
  //  > List all blobs: https://github.com/api/v2/json/blob/all/h5bp/html5-boilerplate/master
  this.request(url, function(e, res) {
    if(e) return this.emit('error', e);
    var blobs = res.body.blobs,
      files = Object.keys(blobs);

    var file = files.filter(function(subpath) {
      return self.path === subpath;
    });

    if(!file) return this.emit('error', new Error('Unable to find sha1 for ' + self.path));


    var raw = self.url('raw', {
      name: self.name,
      repo: self.repo,
      sha1: blobs[file]
    });

    self.request(raw)
      .on('data', self.emit.bind(self, 'data'))
      .on('end', self.emit.bind(self, 'end'));
  });
};

GhRequest.prototype.request = function(url, cb) {
  return !cb ? request(url) :
    request({ uri: url, json: true }, cb);
};

GhRequest.prototype.end = function (chunk) {
  if (chunk) this.write(chunk);
};

