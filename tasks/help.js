
var fs = require('fs'),
  path = require('path'),
  npm = require('npm'),
  viewers = require('../lib/viewers');

var usage = [
  '',
  'page'
];

module.exports = function(grunt, opts) {

  opts = opts || {};
  opts.docspath = opts.docspath || opts.base || path.join(gruntpath, 'docs');
  opts.files = opts.files || '**.md';
  opts.prefix = opts.prefix || 'grunt help:';

  var log = grunt.log;
  grunt.registerTask('help', 'Get help on grunt', function() {
      var cb = this.async(),
      flags = this.flags,
      onGrunt = flags.grunt;

    opts.list = flags['?'];

    if(onGrunt) delete flags.grunt;
    var args = Object.keys(flags);
    resolve('grunt', function(err, gruntpath) {
      if(err) return cb(false);
      // if grunt was passed in one of the term, force the lookup in
      // builtin grunt docs no matter what
      if(onGrunt) opts = {
        docspath: path.join(gruntpath, 'docs'),
        files: '**.md',
        prefix: 'grunt help:'
      };

      help(args, opts, cb);
    });
  });

  grunt.task.registerHelper('help', help);

  function help(args, opts, cb) {
    if(!cb) cb = opts, opts = {};
    if(!opts.docspath) grunt.fail('Help helper needs a docspath');

    var term = args.join(opts.delimiter || '_'),
      docspath = opts.docspath,
      pages = loadDocs(opts.files, opts);

    // guess the correct doc path from provided term
    var page = pages.filter(function(f) {
      return path.basename(f) === term + path.extname(f);
    })[0];

    if(!page) {
      if(term && !opts.list) log.error('Unable to find documentation for ' + term);

      docsfiles = pages.map(function(file) {
        return opts.prefix + file.replace(path.extname(file), '');
      });

      usage = usage.map(function(line) {
        return (opts.prefix + line).replace(/:$/, '');
      });

      return log
        .writeln(opts.list ? '' : ['Usage:'].concat(usage).join(grunt.utils.linefeed))
        .writeln()
        .writeln(log.wordlist(['Pages:'].concat(docsfiles), grunt.utils.linefeed + ' » '));
    }


    // which viewer to use (only stdout now)
    var viewer = grunt.config('viewer') || npm.config.get('viewer');

    var view = viewers[viewer];
    if(!view) return log.error('not a valid viewer ' + viewer);

    if(opts.rename && typeof opts.rename === 'function') page = opts.rename(page, viewer);
    view.call(grunt, page, opts, function(err) {
      if(err) {
        log.error(err);
        return cb(false);
      }
    });
  }

  //
  // Set of helpers, not exposed as grunt helpers. But might be.
  //

  function resolve(name, cb) {
    npm.load({ global: true }, function(er) {
      if(er) return cb(er);
      try {
        cb(null, require.resolve(name));
      } catch(e) {
       // not installed locally, maybe in node prefix?
       fs.stat(path.join(npm.dir, name), function(er) {
         if(er) return cb(new Error(name + ' is not installed. Either it is locally or globally.'));
         cb(null, path.join(npm.dir, name));
       });
      }
    });
  }

  // additional docs paths
  function loadDocs(docs, opts) {
    opts = opts || {};
    var base = opts.docspath || grunt.config('base') || process.cwd();
    files = base ? path.resolve(base, docs) : docs;
    // always unix like path even on win32
    base = base.replace(/\\/g, '/');
    return grunt.file.expandFiles(files)
      // filter the files with leading `_` or `.`
      .filter(function(file) {
        file = path.basename(file);
        return !/[_\.]/.test(file.charAt(0));
      })
      .map(function(file) {
        return file.replace(base, '').replace(/^(\/)|(\\)/g, '')
          .replace(/(\/)|(\\)/g, opts.delimiter || '_')
          .toLowerCase();
      });
  }
};

