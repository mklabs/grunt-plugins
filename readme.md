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

Grunt will include any tasks in `~/.grunt/tasks`. Any files put in there might
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
  will itself require and load any package in the `./tasks/` dir.
* **tasks/init/**: is a special folder only used with built-in `grunt
  init` task. Each `tasks/init/*.js` files are templates that may be
  run via `grunt init:template` command.
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

The gruntfile added will also include necessary config to build
bootstrap's stylesheets from less files. The `watch:less` task may even
be used to recompile them as they're changing.

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


**grunt less**

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


**grunt install**

A basic wrapper on top of npm's install. This simply creates a `grunt
install` task that might be used to install npm packages from grunt
right into the `~/.grunt` directory.

It may come handy when a built-task in `~/.grunt` is missing one more
dependencies:

    grunt install:rimraf
    grunt install:handlebars

    grunt install:clean-css:requirejs:coffee-script

**grunt help**

This task will use the grunt documentation and nicely ouput them in the
console as a manpage. First time the task is called, the latest copy of
grunt documentation are fetched from master repo.

Then [ronnjs](https://github.com/kapouer/ronnjs) is used to generate the
according manpage when the following commands are run:

    grunt help:api
    grunt help:configuring

Running just help will output the following:

    Running "help" task
    >> Unable to find related page for undefined. Valid terms are: api
    >> api_log
    >> configuring
    >> contributing
    >> example_gruntfiles
    >> exit_codes
    >> helpers_directives
    >> task_concat
    >> tasks_builtin
    >> tasks_creating
    >> toc
    Would you like to open the toc page instead?

    Please answer the following:
    [?] toc (Y/n)
    [?] Are these answers correct? (Y/n)

## Tests

Even though tasks may be layout in different and independant nested npm
modules, the top level `npm test` command should be able to aggregate
them.

    npm test

It works by running the `scripts/test.s` and by using npm
programmatically to lookup any `tasks/*/package.json` and run each
package's "test" script.

*Note*: The install commands works pretty much the same. When `npm
install` is run from the top-level dir, it'll use a postinstall script
and the  `scripts/install.js` file to lookup nested package and install
them. This acts much the same ways as cd'ing into each one individually
and installing them on the command-line.
