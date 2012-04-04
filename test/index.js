
var glob = require('glob'),
  path = require('path'),
  npm = require('npm'),
  handler = require('npm/lib/utils/error-handler');

npm.load({ loglevel: 'info' }, function(err) {
  if(err) throw err;

  var packages = glob.sync('tasks/*/package.json').map(function(package) {
    return path.resolve(path.dirname(package));
  });

  return npm.commands.test(packages, handler);
});
