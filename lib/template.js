
var fs = require('fs'),
  path = require('path'),
  util = require('util'),
  events = require('events'),
  rimraf = require('rimraf'),
  Install = require('./install');

module.exports = Template;

var rRepo = /([^\/]+)\/([^\/]+)\/?([^\/]+)?/;

function Template(action, opts) {
  this.opts = opts || {};
  events.EventEmitter.call(this);
  var self = this;

  this.pkgjson = fs.createWriteStream(path.join(__dirname, '../_cache/package.json'));
  process.nextTick(function() {
    self.init(action);
  });
}

util.inherits(Template, events.EventEmitter);

Template.prototype.init = function(action) {
  action = action || 'help';
  this.repo = action.match(rRepo);
  if(this.repo) this.repo = {
    name: this.repo[1],
    repo: this.repo[2],
    branch: this.repo[3] || 'master'
  };

  if(this.repo) {
    action = 'repository';
    this.emit('repo', this.repo);
  }

  if(typeof this[action] !== 'function') return;
  this[action]();
};

Template.prototype.help = function() {
  fs.createReadStream(path.join(__dirname, '../readme.md')).pipe(process.stdout);
};

Template.prototype.repository = function() {
  var data = {};
  var assets = data.assetsDependencies = {};
  var src = [this.repo.name, this.repo.repo, this.repo.branch].join('/');
  bundle = assets[src] = {};
  bundle.src = src;
  bundle.dest = path.join(__dirname, '../tasks/init/github/root/');
  this.pkgjson.write(JSON.stringify(data, null, 2));
  this.pkgjson.end();

  var self = this;
  rimraf(bundle.dest, function(err) {
    if(err) return self.emit('error', err);
    self.install();
  });
};

Template.prototype.install = function(input) {
  input = input || this.pkgjson.path;
  console.log('install', input);
  var install = new Install(fs.createReadStream(input));
  install.on('end', this.emit.bind(this, 'end'));
};
