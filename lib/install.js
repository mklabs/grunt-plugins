// module dependencies
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  zlib = require('zlib'),
  Glob = require('glob').Glob,
  stream = require('stream'),
  request = require('./utils/request'),
  fstream = require('fstream'),
  tar = require('tar'),
  vm = require('vm'),
  mm = require('minimatch');

// install stream
module.exports = Install;

function Install(input, target) {
  this.readable = this.writable = true;
  stream.Stream.call(this);

  var self = this;
  this.input = input;
  this.chunks = [];
  this.files = [];
  this.target = path.resolve(target);

  this.on('error', function(e) {
    console.error(e);
  });

  this.input.on('end', this.fetch.bind(this));

  this.start();
}

//
// tbd: ADD COMMENTS!
//

util.inherits(Install, stream.Stream);

Install.prototype.collect = function() {
  var self = this;
  this.input.on('data', function(c) {
    self.chunks = self.chunks.concat(c);
  });
  return this;
};

Install.prototype.start = function() {
  var self = this;
  this.collect();

  this.started = +new Date();
  this.on('blob', function() {
    var files = this.files;
    self.emit('files', files);
    self.remaining = files.length;
    files.forEach(function(file) {
      self.emit('file', file);

      fs.stat(file.path, function(e) {
        // already cached, copy right away
        if(!e) return self.copy();

        var stream = request(file.url)
          .on('error', function(er) { console.error(er); })
          .on('data', function() { process.stdout.write('.'.grey); });

        // if it's a tarball, pipe through zlib/tar instead of
        // fstream.Writer
        if(path.extname(file.path) === '.tgz' || file.tgz) {
          file.strip = 1;
          stream = stream.pipe(zlib.Unzip()).pipe(tar.Extract(file))
          .on('entry', function(entry) {
            entry.props.uid = entry.uid = 501;
            entry.props.gid = entry.gid = 20;
          });
        } else {
          stream = stream.pipe(fstream.Writer(file));
        }

        // in both case, we're done on close
        stream.on('close', self.copy.bind(self)).on('close', function() {
          // make sure we write a new line on completion (dot on data event)
          process.stdout.write('OK'  + '\n' + '» ' + file.url + '\n');
        });
      });
    });
  });
};

Install.prototype.fetch = function() {
  var body = this.chunks.map(function(c) { return c + ''; }).join('');
  var data = this.data = this.parse(body);

  var deps = Object.keys(this.data)
    .map(function(dep) {
      return {
        name: dep,
        repo: data[dep]
      };
    })
    .map(this.parseEntry);

  (function next(dep, self) {
    if(!dep) return self.emit('blob');

    // if it has an url, then absolute url reference bypass the github api requests
    if(dep.url) {
      self.files = self.files.concat([{
        path: path.join(__dirname, '../_cache/', dep.user, dep.repo, dep.url),
        url: dep.url,
        data: dep
      }]);
      return next(deps.shift(), self);
    }

    var url = 'http://github.com/api/v2/json/blob/all/' + dep.user + '/' + dep.repo +  '/' + dep.version;

    var req = request({
      url: 'http://github.com/api/v2/json/commits/list/' + dep.user + '/' + dep.repo + '/' + dep.version
    });

    req.on('response', function() { this.response.body = ''; });
    req.on('data', function(c) { this.response.body += c; });

    req.on('end', function() {
      var data = JSON.parse(this.response.body);
      if(data.error) return self.emit('error', new Error(data.error));

      var commits = data.commits,
        sha1 = commits[0].id;

      // we'll cache the files
      // depending on sha1 of latest commit
      var cache = path.join(__dirname, '../_cache/', dep.user, dep.repo, sha1);
      var blobs = [{
        src: dep.name + '-tarball',
        path: cache,
        tgz: true,
        url: 'http://nodeload.github.com/' + dep.user + '/' + dep.repo + '/tarball/' + dep.version,
        data: dep
      }];

      self.files = self.files.concat(blobs);
      next(deps.shift(), self);
    });
  })(deps.shift(), this);
};

// parse an assets entry, returning a hash object of user/repo and files
// to install.

var rSrc = /([^\/]+)\/([^\/]+)\/?([^\/]+)?/,
  rDest = /\(\s*([^\)]+)\s*\)/;

Install.prototype.parseEntry = function(entry) {
  // entry.src property is set, assume a hash object
  var dest = entry.repo.dest || ('./assets/vendor/' + entry.name),
    repo = entry.repo.src ? entry.repo.src + ' (' + dest + ')' : entry.repo;

  // entry.files property is set, assume hash object, otherwise glob all
  var files = entry.repo.files || { '**/*' : './' };

  // parse the package string
  var parts = repo.split(' '),
    src = (parts[0].match(rSrc) || []).slice(1),
    dst = ((parts[1] || '').match(rDest) || [])[1];

  // src: user/repo@version or user/repo/branch
  var user = src[0],
    branch = src[2] || 'master',
    version = src[1].split('@')[1] || branch;

  repo = src[1].split('@')[0];

  return {
    url: /\/\//.test(parts[0]) ? parts[0] : '',
    name: entry.name,
    user: user,
    repo: repo,
    dest: dst || dest,
    branch: branch,
    version: version,
    files: files
  };
};

Install.prototype.parse = function(body) {
  try {
    return JSON.parse(body).assetsDependencies;
  } catch(e) {
    console.error(e);
  }
};

// tbd: implemenent a DirReader with minimatch globing.
Install.prototype.copy = function() {
  if(--this.remaining) return;

  // reset remaining counter with files to copy
  this.remaining = this.files.length;

  var self = this;
  (function next(file) {
    if(!file) return;

    var data = file.data,
      cache = file.path,
      dest = data.dest,
      files = data.files || { '**/*': './' };

    // if it has an url, and ends with an extension, copy right away
    if(path.extname(file.url)) {
      dest = path.extname(dest) ? dest : path.join(dest, path.basename(file.url));
      return fstream.Reader(cache).pipe(fstream.Writer({ path: dest }))
        .on('close', function() {
          next(self.files.shift());
        });
    }

    Object.keys(files).forEach(function(pattern) {
      var dests = files[pattern].split(' ').map(function(p) {
        return path.join(data.dest, p);
      });

      var glob = new Glob(pattern, {
        cwd: cache
      });

      var entries = [];
      glob.on('end', function() {
        // each time we get a match, create a new fstream.Reader and copy
        // to appropriate location
        (function copy(e) {
          if(!e) return self.done();
          var src = path.join(cache, e),
            to = path.extname(dest) ? dest : path.join(dest, e);

          fs.stat(src, function(e, stat) {
            if(e) return self.emit('error', e);
            var type = stat.isDirectory() ? 'Directory' : 'File';

            fstream.Reader({ path: src, type: type })
              .pipe(fstream.Writer({ path: to, type: type }))
              .on('close', function() {
                copy(entries.shift());
              });
          });

        })(entries.shift());
      });

      glob.on('match', function(e) {
        entries.push(e);
      });
    });
  })(this.files.shift());
};

Install.prototype.done = function() {
  if(--this.remaining) return;
  process.stdout.write('\n');
  this.emit('install');
  this.emit('end');
};

