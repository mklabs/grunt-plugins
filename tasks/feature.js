
var feature = require('..');

module.exports = function(grunt) {

  grunt.registerMultiTask('features', 'Go through your features and steps files to trigger matching tests', function() {
    var data = this.data;
    if(!data.features) return grunt.warn('Missing features config');
    if(!data.steps) return grunt.warn('Missing steps config');

    // collect files
    var cb = this.async(),
      steps = grunt.file.expandFiles(data.steps),
      features = grunt.file.expandFiles(data.features);

    feature.on('end', function(failed) {
      if(!failed) return cb();
      grunt.log.error('Failed tests: ' + failed);
      return cb(false);
    });

    feature.run({
      steps: steps,
      features: features
    });

  });

};
