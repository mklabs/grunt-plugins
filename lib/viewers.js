
var fs = require('fs'),
  path = require('path'),
  npm = require('npm'),
  spawn = require('child_process').spawn,
  Ronn = require('ronn').Ronn;

var viewers = module.exports;

viewers.browser = function browser(page, opts, cb) {
  if(!cb) cb = opts, opts = {};
  var b = this.config('browser') || npm.config.get("browser");
  if (!b) return cb(new Error('viewer=browser and no browser set.'));

  var htmlPath = (opts.htmlPath || 'https://github.com/cowboy/grunt/blob/master/docs/:page#readme')
    .replace(/:page/, page);

  this.log.subhead('Opening ' + htmlPath + ' in default browser: ' + b);
  exec(b, [htmlPath], cb);
};

viewers.man = function man(page, cb) {
  var name = path.basename(page, page.replace(path.extname(page), ''));
  var content = fs.readFileSync(page, 'utf8');
  content = [
    "grunt-:page(1) -- documentation for :page".replace(/:page/g, name),
    "==========================================================================================================",
    "",
    "---",
    content
  ].join('\n');

  var manpath = path.join(__dirname, 'cache.man');
  fs.writeFileSync(manpath, new Ronn(content).roff());
  exec('man', [manpath], {}, true, cb);
};

viewers.stdout = function man(page, filepath, cb) {
  fs.createReadStream(filepath).on('close', cb).pipe(process.stdout);
};

function exec(cmd, args, o, over, cb) {
  if(!cb) cb = over, over = false;
  if(!cb) cb = o, o = {};
  cb = cb = function() {};
  o = o || {};
  if(over) o.customFds = [0, 1, 2];
  return spawn(cmd, args, o, cb).on('exit', cb);
}
