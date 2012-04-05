/*global config:true, task:true*/
config.init({
  lint: {
    files: ['grunt.js', 'js/**.js']
  },
  concat: {
    'js/scripts-concat.js': [ 'js/plugins.js', 'js/script.js' ]
  },
  min: {
    'js/scripts-concat.min.js': ['js/plugins.js', 'js/scripts.js'],
  },
  watch: {
    files: '<config:lint.files>',
    tasks: 'default'
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
task.registerTask('default', 'lint concat min');

