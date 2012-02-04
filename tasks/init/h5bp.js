
var fs = require('fs'),
  path = require('path'),
  ghf = require('gh-fetch');

var init = module.exports = function(helpers, done) {
  log.subhead('Fetching latest copy of html5-boilerplate files');

  // Now prompt for twitter-bootstrap integration, fetching necessary files from master repo
  var prompts = [
    task.helper('prompt_for', 'dirname', './'),
    task.helper('prompt_for', 'files', '**.*'),
    { message: 'Would you like to include bootstrap files?', name: 'bootstrap', default: 'Y/n' },
    { message: 'Which ones? (ignored if previous answer not Y or y)', name: 'bootstrap_files', default: '**.less js/*.js' }
  ];

  task.helper('prompt', prompts, function(err, props) {
    if(err) return fail.warn(err, 3);

    var dirname = path.resolve(props.dirname),
      abort = path.existsSync(dirname) && fs.readdirSync(dirname).length;

    // fail if provided dirname already exists and not empty
    if(abort) return log.error(new Error(props.dirname + ' already exists and is not empty'));

    // Fetch files into provided dirname directly from github master repo.
    //
    // Files specified may contain one of more glob patterns to include,
    // they'll be copied over the exact same location than the one in original
    // html5-boilerplate repo
    init.h5bp(props.files, dirname, function(err) {
      if(err) return fail.warn(err, 3);

      // handle bootstrap file if we're told to do so
      if(!(/y/i.test(props.bootstrap))) return done();
      init.bootstrap(props.bootstrap_files, dirname, init.plugins(dirname, done));
    });

  });

};

init.h5bp = function h5bp(files, dirname, cb) {
  console.log('init h5bp');
  ghf.fetch(['h5bp/html5-boilerplate'].concat(files.split(' ')), { whereto: dirname }, cb);
};

init.bootstrap = function bootstrap(files, dirname, cb) {
  ghf.fetch(['twitter/bootstrap'].concat(files.split(' ')), { whereto: dirname }, cb);
};

init.plugins = function plugins(dirname, done) { return function(err) {
  if(err) return fail.warn(err, 3);

  // pursue with the prompt of each bootstrap's plugin to concat into
  // js/plugins.js (only if plugins.js was fetched the first time,
  // otherwise no need)
  if(!path.existsSync(path.resolve(dirname, 'js/plugins.js'))) return done();

  // same check on bootstrap plugin files, no need to continue if no js
  // files were fetched to begin with
  var plugins = file.expand(path.join(dirname, 'js/bootstrap-*.js'));
  if(!plugins.length) return done();

  log.subhead("Which bootstrap plugin files would you like concat'd into js/plugins.js");

  log
    .writeln()
    .writeln('Note that popovers requires tooltip plugin to be included first,')
    .writeln('so be sure to include both files if popover is needed.');

  var prompts = plugins.map(function(f) {
    var filename = path.basename(f);
    return {
      message: filename + ' >> js/plugins.js',
      name: filename,
      default: 'Y/n'
    };
  });

  // push a final prompt to ask if these plugins need to be minified
  prompts.push({ message: 'Would you like them to be minified?', name: 'minified', default: 'Y/n'});

  // reverse to ensure tooltip first
  task.helper('prompt', prompts.reverse(), function(err, props) {
    if(err) return fail.warn(err, 3);

    var min = /y/i.test(props.minified);

    var files = Object.keys(props)
      .filter(function(f) {
        if(f === 'minified') return false;
        return (/y/i.test(props[f]));
      }).map(function(f) {
        return path.resolve('js', f);
      });

    var content = task.helper('concat', ['js/plugins.js'].concat(files));
    file.write('js/plugins.js', min ? task.helper('uglify', content, config('uglify')) : content);
    done();
  });
};};
