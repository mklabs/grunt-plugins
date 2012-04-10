var fs = require('fs'),
  path = require('path'),
  zlib = require('zlib'),
  events = require('events'),
  request = require('request'),
  tar = require('tar');

// Check if we're behind some kind of proxy.
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
    process.env.https_proxy || process.env.HTTPS_PROXY || '';

//
// heavily based on npm's util/untar.js file
//
// todo: remove grunt logging api from here.
//
// todo: better error handling (and nodeload Not Found 404-ish case)
//
module.exports = function fetch(tarball, target, cb) {

  // cb is optional, might listen to returned http request object.
  cb = cb || function() {};

  // grunt log
  var log = this.log;

  var r = request.defaults({ proxy: proxy }),
    now = +new Date;

  // tarball untar opts
  var extractOpts = { type: 'Directory', path: target, strip: 1 };

  // remote request --> zlib.Unzip() --> untar into h5bp/root
  var req = r.get(tarball).on('error', cb);


  req
    // first gzip
    .pipe(zlib.Unzip())
    .on('error', function(err) {
      // re-emit the fstream entry to the original request object
      req.emit('error', err);
      console.error('unzip error', err);
      cb(err);
    })
    // then tar extract into h5bp/root
    .pipe(tar.Extract(extractOpts))
    .on('entry', function(entry) {
      // re-emit the fstream entry to the original request object
      req.emit('entry');

      log.write('.');
      // todo: necessary uid/gid set, in stone.. Investigate how npm does,
      // do the same. It works for now.
      entry.props.uid = entry.uid = 501;
      entry.props.gid = entry.gid = 20;
    })
    .on('error', function(err) {
      // re-emit the fstream entry to the original request object
      req.emit('error', err);
      console.error('untar error', err);
      cb(err);
    })
    .on('close', function() {
      req.emit('fetched');
      log.writeln().ok('Done in ' + extractOpts.path).writeln();
      cb();
    });

  return req;
};
