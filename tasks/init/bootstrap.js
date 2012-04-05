
var fs = require('fs'),
  path = require('path'),
  fetch = require('../../lib/fetch'),
  npm = require('npm');

var bootstrap = module.exports;

// Check if we're behind some kind of proxy.
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
    process.env.https_proxy || process.env.HTTPS_PROXY || '';

// Basic template description.
bootstrap.description = 'Init a new twitter bootstrap project.';

// Template-specific notes to be displayed before question prompts.
bootstrap.notes = [
  'If this is the first time you run this command, latest version of twitter/bootstrap',
  'will be downloaded to the appropriate place next to this init template (in bootstrap/root).'
].join(' ');

// Any existing file or directory matching this wildcard will cause a warning.
bootstrap.warnOn = '*';

// The actual init template.
bootstrap.template = function(grunt, init, done) {
  var exists = path.existsSync(path.join(__dirname, 'bootstrap/root'));

  var promptOpts = grunt.helper('prompt_for_obj');
  promptOpts.force_update = {
    message: 'Do you need to force an update on master repo?',
    name: 'force_update',
    default: 'y/N'
  };

  var prompts = [
    // Prompt for these values.
    grunt.helper('prompt_for', 'name'),
    grunt.helper('prompt_for', 'description'),
    grunt.helper('prompt_for', 'version'),
    grunt.helper('prompt_for', 'repository'),
    grunt.helper('prompt_for', 'homepage'),
    grunt.helper('prompt_for', 'licenses'),
    grunt.helper('prompt_for', 'author_name'),
    grunt.helper('prompt_for', 'author_email'),
    grunt.helper('prompt_for', 'author_url')
  ];

  if(exists) prompts.push(grunt.helper('prompt_for', 'force_update'));
  grunt.helper('prompt', { type: 'bootstrap' }, prompts, function(err, props) {
    if(/n/i.test(props.force_update) && exists) return next(props);

    var url = 'https://github.com/twitter/bootstrap/tarball/v2.0.2';
    fetch.call(grunt, url, path.join(__dirname, 'bootstrap/root'), function(err) {
      if(err) {
        grunt.log.error(err.stack || err);
        return done(false);
      }
      next(props);
    });

  });

  function next(props) {
    // Files to copy (and process).
    var files = init.filesToCopy(props);

    // filter the doc files
    files = Object.keys(files).filter(function(file) {
      return !(/^docs/).test(file);
    }).reduce(function(a, b) {
      a[b] = files[b];
      return a;
    }, {});

    // Add properly-named license files.
    init.addLicenseFiles(files, props.licenses);

    // Actually copy (and process) files.
    init.copyAndProcess(files, props);

    // Generate package.json file.
    init.writePackageJSON('package.json', props);

    // All done!
    done();
  }
};

