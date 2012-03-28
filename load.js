
var fs = require('fs'),
  path = require('path'),
  join = path.join,
  vm = require('vm');

var plugin = module.exports;

// allowed extensions
var exts = ['.js', '.coffee'];

plugin.name = 'load';

plugin.attach = function(options) {
  var grunt = this;

  var base = options.dir || options.cwd || options.base ||
      grunt.option('base') || process.cwd();

  // if there's already something named `grunt.load`, fail silently
  // will probably do that at `use` level at some point
  if(grunt.load) return;

  grunt.load = function(dir) {
    dirs = dir || './tasks';
    dirs = Array.isArray(dir) ? dir : [dir];

    dirs = dirs.map(function(dir) {
      return join(base, dir);
    });

    var files = dirs.map(function (dir) {
      return fs.readdirSync(dir).map(function(file) {
        return join(dir, file);
      });
    }).reduce(function(a, b) {
      return a.concat(b);
    });

    // filter files that are not `.js` or `.coffee`
    files = files.filter(function(file) {
      return !!~exts.indexOf(path.extname(file));
    });

    // load each tasks individually
    files.forEach(plugin.loadTask(grunt));
  };
};


plugin.loadTask = function loadTask(grunt) { return function(file) {
  var mod = plugin.require(file);

  // is a function, standard 0.3.x api, execute in grunt context like grunt
  // would do (without the surrounding try/catch).
  if(typeof mod === 'function') return mod.call(grunt, grunt);

  // not a string, not a fn, fail silently
  if(typeof mod !== 'string') return;

  // or we got a string, vm fun time!

  // create the sandbox
  var sandbox = plugin.context(file, grunt);

  // todo: Coffee compile step if needed
  var script = vm.createScript(mod, file);

  // Run!.. and pray that nothing explode
  try {
    script.runInNewContext(sandbox);
  } catch(e) {
    console.error('Error executing', file);
    throw e;
  }
}};

plugin.require = function _require(modpath) {
  try {
    return require(modpath);
  } catch(e) {
    // todo: sanity check on e.message, trying to catch things like
    // "task is not defined" but for all no more global object: task, config, log, etc.

    // fallback to vm trickerya, returns the raw string, `plugin.require` will
    // do the rest
    return fs.readFileSync(modpath, 'utf8');
  }
};

// **context** creates a new context suitable to use with vm module
plugin.context = function context(filename, grunt, sb) {
  sb = sb || {};

  var dirname = path.dirname(filename);

  // extend context
  sb.require = sb.require || function (p) {
    var rel = p.match(/^\.\.?\//);
    return require(rel ? path.resolve(dirname, p) : p);
  };

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

  return sb;
};
