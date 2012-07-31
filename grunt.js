module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // mocha is a multi-task, you can defined target specific options. These
    // options maps mocha ones.
    //
    // For each target, specify a `src` Array of glob patterns.
    mocha: {
      options: {
        reporter: 'spec'
      },

      // test each different ui
      bdd: {
        src: ['test/mocha.js'],
        options: {
          reporter: 'nyan',
          timeout: 2000
        }
      },
      tdd: {
        src: ['test/mocha-tdd.js'],
        options: {
          ui: 'tdd'
        }
      },
      exports: {
        src: ['test/mocha-exports.js'],
        options: {
          ui: 'exports'
        }
      },
      qunit: {
        src: ['test/mocha-qunit.js'],
        options: {
          ui: 'qunit'
        }
      },
      dot: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'dot'
        }
      },

      // and reporters
      doc: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'doc'
        }
      },
      spec: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'spec'
        }
      },
      json: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'json'
        }
      },
      progress: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'progress'
        }
      },
      list: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'list'
        }
      },

      tap: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'tap'
        }
      },
      landing: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'landing'
        }
      },
      xunit: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'xunit'
        }
      },
      teamcity: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'teamcity'
        }
      },
      htmlcov: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'html-cov'
        }
      },
      jsoncov: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'json-cov'
        }
      },
      min: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'min'
        }
      },
      jsonstream: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'json-stream'
        }
      },
      markdown: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'markdown'
        }
      },
      nyan: {
        src: '<config:mocha.bdd.src>',
        options: {
          reporter: 'nyan'
        }
      }
    }
  });

  // Load local tasks.
  grunt.loadTasks('tasks');

  // Default task.
  grunt.registerTask('default', 'mocha');

};
