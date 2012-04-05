/*global config:true, task:true*/
config.init({
  lint: {
    files: ['grunt.js', 'scripts.js']
  },
  concat: {
    'js/scripts-concat.js': [ 'js/plugins.js', 'js/script.js' ]
  },
  min: {
    'js/scripts-concat.min.js': ['js/plugins.js', 'js/scripts.js'],
  },
  watch: {
    files: '<config:lint.files>',
    tasks: 'default',

    less: {
      files: 'less/*.less',
      tasks: 'less'
    }
  },
  less: {
    'css/bootstrap.css': ['less/bootstrap.less'],
    'css/bootstrap.min.css': ['less/bootstrap.less'],
    'css/bootstrap-responsive.css': ['less/responsive.less'],
    'css/bootstrap-responsive.min.css': ['less/responsive.less'],
    'css/style.css': ['less/bootstrap.less', 'less/responsive.less']
  },
  jshint: {
    options: {
      curly: true,
      eqeqeq: true,
      immed: true,
      latedef: true,
      newcap: true,
      noarg: true,
      sub: true,
      undef: true,
      boss: true,
      eqnull: true,
      node: true
    },
    globals: {}
  }
});

// Default task.
task.registerTask('default', 'watch:less');

