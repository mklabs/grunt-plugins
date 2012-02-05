Collection of custom [grunt](https://github.com/cowboy/grunt) tasks and
scaffolding templates.

Grunt has this really nice feature when it scans for any user related
tasks and location. It's maybe not really well documented yet, but it's
kinda hot if you ask me.

It's like dotfiles but for grunt.

## install

    git clone git://github.com/mklabs/gruntfiles.git ~/.grunt
    cd ~/.grunt
    npm install

The `npm install` command will install the appropriate dependencies in
`~/.grunt`, and run the postinstall script `scripts/install.js`.

This postinstall script will lookup for any `package.json` in the tasks
dir and try to install each nested modules individually.

    grunt --help

You should see no red here and the few additionnal tasks added.

## description

It'll include any tasks in `~/.grunt/tasks`. Any files put in there might
override built-in tasks or create new custom one.

In addition to that, grunt has this special `init` task that can be used
to setup a variety of scaffolding use case. It'll also scan the
`~/.grunt/tasks/init` folder to lookup any valid templates.

I'll be using this repo to manage my collection of grunt custom tasks
and scaffolding templates.

## components

There's a few special files in the hierarchy.

* **tasks/*.js**: Any `.js` files in the `~/.grunt/tasks` dir are
  automatically loaded by grunt.
* **tasks/autoload.js**: This file, being a `.js` file inside the
  `~/.grunt/tasks` directory, is automatically loaded by grunt and
* **tasks/*/package.json**: Any package.json get loaded by the npm
  scripts (see below) and enables tasks to be layout in their own
  modules.
* **scripts/***: Any npm script related files are put in there (postinstall,
  test, update, ...). Usually, they'll lookup for appropriate
  `package.json` files tasks and use npm programmatically.

The idea is that any other folder in `tasks/` than the `init` one is
required to load-in any additional tasks or helpers. This autoload
mechanism + the npm install script enables task to be contained within
their own module, with dependencies properly sandboxed.


### Tasks

**grunt init:vows**

This one is pretty simple and will prompt for various informations to
generate a basic vows suite inside the `./test/` dir.

    Running "init:vows" (init) task

    Please answer the following:
    [?] Project name (projectname)
    [?] filename (test.js)
    [?] subject (The Deep Thought)
    [?] context (An instance of DeepThought)
    [?] vows (should know the answer to the ultimate question of life)
    [?] Are these answers correct? (Y/n)

    Writing test/test.js...OK

    Initialized from template "vows".

    Done, without errors.


**grunt init:h5bp**

This one will fetch latest copy of html5-boilerplate files from master
and add a basic `grunt.js` file at the dirname location.

    Running "init:h5bp" (init) task

    Fetching latest copy of html5-boilerplate files

    Please answer the following:
    [?] dirname (./)
    [?] files (**.*)
    [?] Are these answers correct? (Y/n)


    Fetching 18 files from h5bp/html5-boilerplate repo...
    ..................OK
    Writing grunt.js...OK

    Initialized from template "h5bp".


**grunt init:h5bp:bootstrap**

This one is slight variation of `init:h5bp` by adding in a few prompts
to remotely fetch files from twitter bootstrap's repo too.

    Running "init:h5bp:bootstrap" (init) task

    Fetching latest copy of html5-boilerplate files

    Please answer the following:
    [?] dirname (./)
    [?] files (**.*)
    [?] Would you like to include bootstrap files? (Y/n)
    [?] Which ones? (ignored if previous answer not Y or y) (**.less js/*.js)
    [?] Are these answers correct? (Y/n)


    Fetching 18 files from h5bp/html5-boilerplate repo...
    ..................OK

    Fetching 47 files from twitter/bootstrap repo...
    ...............................................OK

    Which bootstrap plugin files would you like concat'd into js/plugins.js

    Note that popovers requires tooltip plugin to be included first,
    so be sure to include both files if popover is needed.

    Please answer the following:
    [?] Would you like them to be minified? (Y/n)
    [?] bootstrap-typeahead.js >> js/plugins.js (Y/n)
    [?] bootstrap-transition.js >> js/plugins.js (Y/n)
    [?] bootstrap-tooltip.js >> js/plugins.js (Y/n)
    [?] bootstrap-tab.js >> js/plugins.js (Y/n)
    [?] bootstrap-scrollspy.js >> js/plugins.js (Y/n)
    [?] bootstrap-popover.js >> js/plugins.js (Y/n)
    [?] bootstrap-modal.js >> js/plugins.js (Y/n)
    [?] bootstrap-dropdown.js >> js/plugins.js (Y/n)
    [?] bootstrap-collapse.js >> js/plugins.js (Y/n)
    [?] bootstrap-carousel.js >> js/plugins.js (Y/n)
    [?] bootstrap-button.js >> js/plugins.js (Y/n)
    [?] bootstrap-alert.js >> js/plugins.js (Y/n)
    [?] Are these answers correct? (Y/n)

    Writing grunt.js...OK

    Initialized from template "h5bp".

    Done, without errors.


**grunt less*

The less task will compile any expanded less files into raw CSS. It'll
run a compilation through the less compiler for each files in the
fileset. The CSS results of these less files is then concat'd into the
destincation file.

Just as the built-in concat / min grunt tasks, the destination file
(the file that'll be written to the file system) is guessed by resolving
the subprop task name.

      ...
      less: {
        'css/bootstrap.css': ['less/bootstrap.less'],
        'css/bootstrap.min.css': ['less/bootstrap.less'],
        'css/bootstrap-responsive.css': ['less/responsive.less'],
        'css/bootstrap-responsive.min.css': ['less/responsive.less'],
        'css/style.css': ['less/bootstrap.less', 'less/responsive.less']
      },
      ...

Would output the following to the console when `grunt less is run`:

      Running "less:css/bootstrap.css" (less) task
      Writing to ./css/bootstrap.css...OK

      Running "less:css/bootstrap.min.css" (less) task
      Writing to ./css/bootstrap.min.css...OK

      Running "less:css/bootstrap-responsive.css" (less) task
      Writing to ./css/bootstrap-responsive.css...OK

      Running "less:css/bootstrap-responsive.min.css" (less) task
      Writing to ./css/bootstrap-responsive.min.css...OK

      Running "less:css/style.css" (less) task
      Writing to ./css/style.css...OK

      Done, without errors.
