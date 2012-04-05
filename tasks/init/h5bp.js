
var fs = require('fs'),
  path = require('path'),
  fetch = require('../../lib/fetch');

var h5bp = module.exports;

// Check if we're behind some kind of proxy.
var proxy = process.env.http_proxy || process.env.HTTP_PROXY ||
    process.env.https_proxy || process.env.HTTPS_PROXY || '';

// Basic template description.
h5bp.description = 'Init a new html5-boilerplate project.';

// Template-specific notes to be displayed before question prompts.
h5bp.notes = [
  'If this is the first time you run this command, latest version of html5-boilerplate',
  'will be downloaded to the appropriate place next to this init template (in h5bp/root).'
].join(' ');

// Any existing file or directory matching this wildcard will cause a warning.
h5bp.warnOn = '*';

// The actual init template.
h5bp.template = function(grunt, init, done) {
  var exists = path.existsSync(path.join(__dirname, 'h5bp/root/index.html'));

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
  grunt.helper('prompt', { type: 'h5bp' }, prompts, function(err, props) {
    if(/n/i.test(props.force_update) && exists) return next(props);

    var url = 'https://github.com/h5bp/html5-boilerplate/tarball/master';
    fetch.call(grunt, url, path.join(__dirname, 'h5bp/root'), function(err) {
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

