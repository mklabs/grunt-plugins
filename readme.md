# grunt-templates

Grunt templates

## Getting Started

Install this grunt plugin next to your project's
[grunt.js gruntfile][getting_started] with: `npm install
grunt-templates`

Then add this line to your project's `grunt.js` gruntfile:

```javascript task.loadNpmTasks('grunt-templates'); ```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Synopsis

So, you want to create a new project and you know about Grunt and its
init templates. You decide to create a new template, you put this in
your `~/.grunt` directory, it works, that's awesome.

And then, you might want to create a project from one of the many
boilerplate available on GitHub. `grunt-templates` might help.

Say you want to create a new project, based on HTML5 Boilerplate.

```sh
$ grunt-templates h5bp/html5-boilerplate
# bunch of prompts


```

A new project, based on your inputs, is created based on the lastest
version of h5bp/html5-boilerplate repo.

And then, you might want to add a bunch of stuff to this init template,
you might want to fetch and replace the default h5bp's style.css by
something else. You might want to create your very own boilerplate, a
mixture of the solid fundations of h5bp and bring it in the CSS of
twitter/bootstrap and its jQuery plugins.

You would do something like:

```sh
$ grunt-templates h5bp/html5-boilerplate twitter/bootstrap
# bunch of prompts

```

This results in the following structure:

```sh
a tree
```

And then, you might want to create a bunch of project, each time based
on the same boilerplate.

So, you'll create a `package.json` with the following properties:


```js
{
  "author": "me",
  "name": "my-package",
  "description": "my-package description",
  "version": "0.2.1",
  "private": "true",
  "dependencies": {
  },

  "devDependencies": {
  },

  "assetsDependencies": {

    "h5bp": "h5bp/html5-boilerplate (./)",

    "underscore": {
      "src": "documentcloud/underscore",
      "dest": "js/vendor",
      "files": {
        "underscore.js": "underscore.js"
      }
    },

    "backbone": {
      "src": "documentcloud/backbone@0.9.2",
      "dest": "js/vendor",
      "files": {
        "backbone.js": "backbone.js"
      }
    },

    "bootstrap": {
      "src": "twitter/bootstrap",
      "dest": "./",
      "files": {
        "less/*.less": "css/less",
        "img/*": "css/less/img",
        "js/*.js": "js/vendor/bootstrap"
      }
    }
  }
}

```

Or maybe you prefer putting this config in your project Gruntfile:

```js
var Template = require('grunt-templates').Template;

module.expoets = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    installl:
      h5bp: "h5bp/html5-boilerplate (./)",

      underscore: {
        "src": "documentcloud/underscore",
        "dest": "js/vendor",
        "files": {
          "underscore.js": "underscore.js"
        }
      },

      backbone: {
        "src": "documentcloud/backbone@0.9.2",
        "dest": "js/vendor",
        "files": {
          "backbone.js": "backbone.js"
        }
      },

      bootstrap: {
        "src": "twitter/bootstrap",
        "dest": "./",
        "files": {
          "less/*.less": "css/less",
          "img/*": "css/less/img",
          "js/*.js": "js/vendor/bootstrap"
        }
      }
    }
  });

  grunt.registerMultiTask('install', 'Install the universe', function() {
    // get the task target configuration
    var data = this.data,
      target = this.target;

    // async task
    var cb = this.async();

    // and fill in a new Template
    var template = new Template(data);

    // you can now process the template, this will fetch latest files
    // from Github (tarball fetch), gzip/untar the content in a local
    // cache and copy appropriate files based on the rules you have
    // defined

    template.install(function(err) {
      // you get an error if there is
      if(err) {
        grunt.log.error(err);
        return cb(false);
      }

      grunt.log.ok('Installed ' + target);
      cb();
    });

    // template is an EventEmitter, so the following is valid
    template.on('entry', function(file) {
      grunt.log.writeln('Installing', file);
    });

    template.on('error', function(err) {
      grunt.log
        .error('Oups something went wront')
        .error(err);
    });

    template.on('end', function() {
      grunt.log.ok('All done!');
      // you might omit the callback for install, and trigger the grunt
      // async handler here.

      // cb();
    });

  });
}
```


