
var npm = require('npm'),
  path = require('path');

task.registerInitTask('install', 'Install an npm package right into your ~/.grunt directory', function() {
  var cb = this.async(),
    args = Array.prototype.slice.call(arguments);

  npm.load(config('npm'), function(err) {
    if(err) return fail.warn(err, 3);

    verbose.or.writeln('Install ' + args.join(' ') + '...');

    npm.commands.install(path.resolve(process.env.HOME, '.grunt'), args, function(err) {
      if(err) {
        verbose.or.error(err.stack || err);
        return fail.warn(err, 3);
      }

      verbose.or.ok();

      cb();
    })
  });
});
