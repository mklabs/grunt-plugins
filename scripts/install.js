
var fs = require('fs'),
  glob = require('glob'),
  path = require('path'),
  npm = require('npm'),
  log = require('npm/lib/utils/log'),
  errHandler = require('npm/lib/utils/error-handler');

npm.load({ loglevel: 'info' }, function(err) {
  if(err) throw err;

  glob.sync('tasks/*/package.json').forEach(function(package) {
    var dirname = path.dirname(package),
      deps = JSON.parse(fs.readFileSync(package, 'utf8')).dependencies;

    log.info('process ' + package, 'grunt');

    deps = Object.keys(deps).map(function(f) {
      if(/^https?:\/\//.test(deps[f])) return f;
      return [f, deps[f]].join('@');
    });

    npm.commands.install(dirname, deps, errHandler);
  });

});
