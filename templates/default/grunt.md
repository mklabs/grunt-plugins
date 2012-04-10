

## Automating Website Optimizations

* [Introduction](../)
* » [Grunt](../grunt/)
* [Grunt plugins](../grunt-plugins/)
* [h5bp/node-build-script](../node-build-script/)

---

```js
{
  "author": "Mickael Daniel",
  "github": "http://github.com/mklabs",
  "twitter": "@mklabs",
  "date": "new Date('Mon Apr 10 2012 19:00:00 GMT+0200')"
  "dependencies": {
    "your-attention": "1.0.0"
  }
}
```

## Introducing Grunt

> I’ve been working on a new open-source project lately. To be honest,
I’ve been so busy coding that I haven’t had time to write about it, but
since everyone at Bocoup got together the other day and told me I had to
write a blog post—apparently they’re pretty excited—I’d like to
introduce grunt.
>
> in *[Introducing Grunt](http://weblog.bocoup.com/introducing-grunt/)*


<pre><code class="sh" style="opacity: 0.25;">
grunt: a task-based command line build tool for JavaScript projects. (v0.3.7)

Usage
 grunt [options] [task [task ...]]

Options
    --help, -h  Display this help text.                                        
        --base  Specify an alternate base path. By default, all file paths are 
                relative to the "grunt.js" gruntfile. (grunt.file.setBase) *   
    --no-color  Disable colored output.                                        
      --config  Specify an alternate "grunt.js" gruntfile.                     
   --debug, -d  Enable debugging mode for tasks that support it. For detailed  
                error stack traces, specify --debug 9.                         
   --force, -f  A way to force your way past warnings. Want a suggestion? Don't
                use this option, fix your code.                                
       --tasks  Additional directory paths to scan for task and "extra" files. 
                (grunt.loadTasks) *                                            
         --npm  Npm-installed grunt plugins to scan for task and "extra" files.
                (grunt.loadNpmTasks) *                                         
    --no-write  Disable writing files (dry run).                               
 --verbose, -v  Verbose mode. A lot more information output.                   
     --version  Print the grunt version.                                       

Options marked with * have methods exposed via the grunt API and should instead
be specified inside the "grunt.js" gruntfile wherever possible.

Available tasks
        concat  Concatenate files. *                                           
          init  Generate project scaffolding from a predefined template.       
          lint  Validate files with JSHint. *                                  
           min  Minify files with UglifyJS. *                                  
         qunit  Run QUnit unit tests in a headless PhantomJS instance. *       
        server  Start a static web server.                                     
          test  Run unit tests with nodeunit. *                                
         watch  Run predefined tasks whenever watched files change.            
       default  Alias for "init" task.                                         
       impress  Reads a markdown, Generates a basic impress.js presentation    
       install  Install an npm package right into your ~/.grunt directory      
          less  compiles less files *                                          

Tasks run in the order specified. Arguments may be passed to tasks that accept
them by using semicolons, like "lint:files". Tasks marked with * are "multi
tasks" and will iterate over all sub-targets if no argument is specified.

The list of available tasks may change based on tasks directories or grunt
plugins specified in the "grunt.js" gruntfile or via command-line options.

For more information, see https://github.com/cowboy/grunt
</code></pre>

## What is grunt?

Grunt is a task-based command line build tool for JavaScript projects.

* by ["cowboy" Ben Alman](https://github.com/cowboy/)

* [GitHub Repository](https://github.com/cowboy/grunt/)

* [Documentation](https://github.com/cowboy/grunt/blob/master/docs/toc.md)

## Install!


**`npm install grunt -g`**

## Intro

* Each time grunt is run

  * *Looks in the current directory for the gruntfile, a file named grunt.js*

  * *Walks the directory structure until it finds one.*


### Gruntfile

> [The grunt.js file, aka "gruntfile"](https://github.com/cowboy/grunt/blob/master/docs/getting_started.md#the-grunt-js-file-aka-gruntfile)

Typically placed in the root of the project repository

* Project configuration
* Loading grunt plugins or tasks folders
* Tasks and helpers

----

```js
module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    lint: {
      all: ["grunt.js", "lib/**/*.js""test/**/*.js"]
    },
    jshint: {
      options: {
        browser: true
      }
    }
  });
  // Load tasks from "grunt-sample" grunt plugin installed via Npm.
  grunt.loadNpmTasks("grunt-sample");
  // Default task.
  grunt.registerTask("default", "lint sample");
};
```

### Gruntfile

> [Project configuration](https://github.com/cowboy/grunt/blob/master/docs/getting_started.md#project-configuration)

<pre style="margin: 0;"><code class="js" style="font-size: 0.4em; color: #222;">
// Project configuration.
grunt.initConfig({
  // Project metadata, used by some directives, helpers and tasks.
  meta: {},
  // Lists of files to be concatenated, used by the "concat" task.
  concat: {},
  // Lists of files to be linted with JSHint, used by the "lint" task.
  lint: {},
  // Lists of files to be minified with UglifyJS, used by the "min" task.
  min: {},
  // Lists of files or URLs to be unit tested with QUnit, used by the "qunit" task.
  qunit: {},
  // Configuration options for the "server" task.
  server: {},
  // Lists of files to be unit tested with Nodeunit, used by the "test" task.
  test: {},
  // Configuration options for the "watch" task.
  watch: {},
  // Global configuration options for JSHint.
  jshint: {},
  // Global configuration options for UglifyJS.
  uglify: {}
});
</code></pre>

### Tasks

*Tasks are grunt's core functionality*

```sh
$ grunt lint test
```

*Runs both the `lint` and `test` tasks*


### Built-in Tasks


```sh
concat - Concatenate files.
init - Generate project scaffolding from a predefined template.
lint - Validate files with JSHint.
min - Minify files with UglifyJS.
qunit - Run QUnit unit tests in a headless PhantomJS instance.
server - Start a static web server.
test - Run unit tests with nodeunit.
watch - Run predefined tasks whenever watched files change.
```

### Custom tasks

* In addition to the built-in tasks
  * we can create our own tasks!

```js
module.exports = function(grunt) {
  // Create a new task.
  grunt.registerTask("awesome", "Print out "awesome!!!"", function() {
    var awesome = grunt.helper("awesome");
    grunt.log.write(awesome);
  });
  // Register a helper.
  grunt.registerHelper("awesome", function() {
    return "awesome!!!";
  });
};
```

### Types of tasks

* [Alias-tasks](https://github.com/cowboy/grunt/blob/master/docs/types_of_tasks.md#alias-tasks)
* [Multi-tasks](https://github.com/cowboy/grunt/blob/master/docs/types_of_tasks.md#multi-tasks)
* [Custom-tasks](https://github.com/cowboy/grunt/blob/master/docs/types_of_tasks.md#custom-tasks)

### Tasks API

* [grunt.registerTask](https://github.com/cowboy/grunt/blob/master/docs/api.md#grunt-registertask)
* [grunt.registerMultiTask](https://github.com/cowboy/grunt/blob/master/docs/api.md#grunt-registermultitask)
* [grunt.registerInitTask](https://github.com/cowboy/grunt/blob/master/docs/api.md#grunt-registerinittask)

### Helpers

> [Defining and Executing Helpers](https://github.com/cowboy/grunt/blob/master/docs/api.md#defining-and-executing-helpers)


Utility functions that can be used by any task.

```sh
grunt.registerHelper("now", function(message) {
  return message + " " + new Date();
});
```

### Helpers

An then in any task, the `now` helper is "now" available.

```js
grunt.registerTask("time", "What time is it", function() {
  grunt.log.writeln(grunt.helper("now", "Hello LyonJS"));
});
```

### Grunt API

Grunt provides a lot of utilities, and has a really extensive
documentation, explaining each part in details.

**[Grunt API](https://github.com/cowboy/grunt/blob/master/docs/api.md#readme)**


[Config](https://github.com/cowboy/grunt/blob/master/docs/api_config.md) /
[Fail](https://github.com/cowboy/grunt/blob/master/docs/api_fail.md) /
[File](https://github.com/cowboy/grunt/blob/master/docs/api_file.md) /
[Log](https://github.com/cowboy/grunt/blob/master/docs/api_log.md) /
[Tasks](https://github.com/cowboy/grunt/blob/master/docs/api_task.md) /
[Template](https://github.com/cowboy/grunt/blob/master/docs/api_template.md) /
[Utils](https://github.com/cowboy/grunt/blob/master/docs/api_utils.md)

Amazing job on documentation

# The Init Task

---

**[Initializing a new project](http://weblog.bocoup.com/introducing-grunt/#initializing-a-new-project)**

> This might be my favorite grunt feature. The init task initializes a
> new project, based on the current environment and the answers to a few
> questions. Once complete, a grunt.js configuration file will be
> generated along with a complete directory structure, including a basic
> readme, license, package.json, sample source files and unit tests
> (etc). The exact files and contents created depend on the template
> chosen along with the answers to the questions asked.

> Now, instead of sketching out an idea in a quick one-off gist, I can
> create the scaffolding for an entire project in about 10 seconds,
> “fill in the blanks,” and then run grunt to lint, test, concat and
> minify my code. If everything passes, I can then commit and push my
> code. And anyone who wants to contribute to the project can install
> grunt and do the same.

> There are currently a handful of built-in init templates, including a
> “jquery” template that has been designed to create a basic jQuery
> plugin compatible with the upcoming jQuery plugins site, and a generic
> “gruntfile” template that can be used to very quickly add a grunt.js
> gruntfile to an existing project. You can override init template files
> if you want to customize a built-in init template or create your own.
> And your templates don’t need to be grunt-related. You could create an
> init template that builds out models or views or package.json
> files—whatever you need.

> If you want to try the init task, cd to an empty directory, run the
> command grunt init:jquery (assuming grunt is already installed) and
> follow the on-screen prompts. When grunt is done creating files, poke
> around. Run grunt. See what happens.

### grunt init

```sh
$ grunt init
Running "init" task
This task will create one or more files in the current directory, based on the
environment and the answers to a few questions. Note that answering "?" to any
question will show question-specific help and answering "none" to most questions
will leave its value blank.

Loading init template...ERROR
>> A valid template name must be specified, eg. "grunt init:commonjs". The
>> currently-available init templates are:
>> commonjs - Create a commonjs module, including Nodeunit unit tests.
>> gruntfile - Create a basic grunt.js gruntfile.
>> gruntplugin - Create a grunt plugin, including Nodeunit unit tests.
>> jquery - Create a jQuery plugin, including QUnit unit tests.
>> node - Create a Node.js module, including Nodeunit unit tests.
```

### grunt init

Works with *init templates*

Templates are composed of two parts:

* **an "init template"**:
a script that describes what happens when `grunt init:TEMPLATE` is
run (prompts, file-to-be-copied, etc.)

* a `root/` folder

## grunt init

Init templates may use [rename
rules](https://github.com/cowboy/grunt/blob/master/docs/task_init.md#renaming-or-excluding-template-files),
or be overriden by files in your grunt user directory (`~/.grunt/`)

There's more power built-in the init task, check out the [init task
doc](https://github.com/cowboy/grunt/blob/master/docs/task_init.md) for
more informations.

---

<p style="font-size: 2em; text-align: center; margin-left: 1em;">Happy grunting!</p>

<i class="buddy" style="color: #222; opacity: 0.1;"></i>

## Next!

