
var fs = require('fs'),
  glob = require('glob'),
  path = require('path'),
  rimraf = require('rimraf'),
  npm = require('npm'),
  log = require('npm/lib/utils/log');

npm.load({ loglevel: 'info' }, function(err) {
  if(err) throw err;

  glob.sync('tasks/*/package.json').forEach(function(package) {
    var dirname = path.dirname(package);
    log.info('process ' + package, 'grunt');
    rimraf.sync(path.join(dirname, 'node_modules'));
    log.info('Removed ' + path.join(dirname, 'node_modules'), 'grunt');
  });
});
