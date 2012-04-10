
## Automating Website Optimizations

* [Introduction](../)
* [Grunt](../grunt/)
* » [Grunt plugins](../grunt-plugins/)
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

## Grunt Plugins

Introduced in `0.3.x`

* Grunt currently has preliminary plugin support

* But is already great at packaging a set of tasks / wrapping a "custom"
  grunt binary

## Grunt Plugins

A way to package a set of tasks that get referenced in `grunt.js` when run via `grunt`.

A custom global binary wrapping a specific version of grunt, plus some specific extra stuff.

## Grunt Plugins

* [grunt-css](https://github.com/jzaefferer/grunt-css): Grunt plugin for linting and minifying CSS 
* [grunt-less](https://github.com/jharding/grunt-less): Grunt task for LESS
* [grunt-bbb](https://github.com/backbone-boilerplate/grunt-bbb): Backbone Boilerplate framework tool.
* [gruntExamples](https://github.com/Takazudo/gruntExamples): grunt.js examples for me or someone else
* [build-taks](https://github.com/vanetix/build-tasks): A collection of useful grunt build tasks

[Documentation](https://github.com/cowboy/grunt/blob/master/docs/plugins.md)

## Creating a new plugin

The `grunt init:grunt` allows you easily start a default grunt plugin
structure.


<pre><code class="sh" style="opacity: 0.25;">
"gruntplugin" template notes:
The grunt plugin system is still under development. For more information, see
the docs at https://github.com/cowboy/grunt/blob/master/docs/plugins.md

Please answer the following:
[?] Project name (grunt-gruntplugin)
[?] Description (The best sample grunt tasks ever.) Trying to create a grunt plugin in 20min or so
[?] Version (0.1.0) 
[?] Project git repository (git://github.com/mk/grunt-base64.git) 
[?] Project homepage (https://github.com/mk/grunt-base64) 
[?] Project issues tracker (https://github.com/mk/grunt-base64/issues) 
[?] Licenses (MIT) 
[?] Author name (Mickael Daniel) 
[?] Author email (daniel.mickael@gmail.com) 
[?] Author url (none) 
[?] What versions of grunt does it require? (~0.3.7) 
[?] What versions of node does it run on? (*) 
[?] Do you need to make any changes to the above before continuing? (y/N) 

Writing .npmignore...OK
Writing bin/grunt-gruntplugin...OK
Writing grunt.js...OK
Writing README.md...OK
Writing tasks/gruntplugin.js...OK
Writing test/gruntplugin_test.js...OK
Writing LICENSE-MIT...OK

Initialized from template "gruntplugin".
```
</code></pre>

## Tasks

A plugin will most likely need to do something useful

This is usually done by defining a new task. Plugins are a great way to
package tasks and helpers that can be installed and managed through npm.

```js
// Load tasks from "grunt-sample" grunt plugin installed via Npm.
grunt.loadNpmTasks("grunt-sample");
```

## Tasks

The `tasks/` directory must be used, and mimics grunt's internal
directory structure.

When
[loadNpmTasks](https://github.com/cowboy/grunt/blob/master/docs/api.md#grunt-loadnpmtasks)
is used (typically from within a gruntfile), Grunt will load the tasks
in *`node_modules/grunt-plugin/tasks`* and make them availale in your
grunt setup.

## Let's create a new plugin

* Won't do much

* Some fancy ASCII Art

* Let's name it *`grunt-fancy-ascii`*!

#### Configuration

`grunt.js`

```js
module.exports = function(grunt) {
  grunt.initConfig("ascii", {
    color: "bold"
  });

  // Load local tasks.
  grunt.loadTasks("tasks");

  // Default task.
  grunt.registerTask("default", "sourcemap");
};
```

#### Tasks

```js
var fs = require('fs'),
  path = require('path');

module.exports = function(grunt) {
  grunt.registerTask('ascii', 'Fancy ascii art', function() {
    var cb = this.async();
    var rs = fs.createReadStream(path.join(__dirname, '../lyonjs.txt')).on('end', cb);
    var colors = Array.prototype.slice.call(arguments);
    // no color! raw stdout
    if(!colors.length) return rs.pipe(process.stdout);
    // color was set! listen for incoming data
    rs.setEncoding('utf8');
    rs.on('data', function(c) {
      // apply each color, rainbow lyonjs is rainbow!
      colors.forEach(function(color) {
        console.log(c[color]);
      });
    });
  });
};
```

## grunt ascii?

<pre style="font-size: 0.6em; opacity: 0.8;"><code>
$ grunt ascii

Running "ascii" task
          _____        _____                   _______                   _____                    _____                    _____          
         /\    \      |\    \                 /::\    \                 /\    \                  /\    \                  /\    \         
        /::\____\     |:\____\               /::::\    \               /::\____\                /::\    \                /::\    \        
       /:::/    /     |::|   |              /::::::\    \             /::::|   |                \:::\    \              /::::\    \       
      /:::/    /      |::|   |             /::::::::\    \           /:::::|   |                 \:::\    \            /::::::\    \      
     /:::/    /       |::|   |            /:::/~~\:::\    \         /::::::|   |                  \:::\    \          /:::/\:::\    \     
    /:::/    /        |::|   |           /:::/    \:::\    \       /:::/|::|   |                   \:::\    \        /:::/__\:::\    \    
   /:::/    /         |::|   |          /:::/    / \:::\    \     /:::/ |::|   |                   /::::\    \       \:::\   \:::\    \   
  /:::/    /          |::|___|______   /:::/____/   \:::\____\   /:::/  |::|   | _____    _____   /::::::\    \    ___\:::\   \:::\    \  
 /:::/    /           /::::::::\    \ |:::|    |     |:::|    | /:::/   |::|   |/\    \  /\    \ /:::/\:::\    \  /\   \:::\   \:::\    \ 
/:::/____/           /::::::::::\____\|:::|____|     |:::|    |/:: /    |::|   /::\____\/::\    /:::/  \:::\____\/::\   \:::\   \:::\____\
\:::\    \          /:::/~~~~/~~       \:::\    \   /:::/    / \::/    /|::|  /:::/    /\:::\  /:::/    \::/    /\:::\   \:::\   \::/    /
 \:::\    \        /:::/    /           \:::\    \ /:::/    /   \/____/ |::| /:::/    /  \:::\/:::/    / \/____/  \:::\   \:::\   \/____/ 
  \:::\    \      /:::/    /             \:::\    /:::/    /            |::|/:::/    /    \::::::/    /            \:::\   \:::\    \     
   \:::\    \    /:::/    /               \:::\__/:::/    /             |::::::/    /      \::::/    /              \:::\   \:::\____\    
    \:::\    \   \::/    /                 \::::::::/    /              |:::::/    /        \::/    /                \:::\  /:::/    /    
     \:::\    \   \/____/                   \::::::/    /               |::::/    /          \/____/                  \:::\/:::/    /     
      \:::\    \                             \::::/    /                /:::/    /                                     \::::::/    /      
       \:::\____\                             \::/____/                /:::/    /                                       \::::/    /       
        \::/    /                              ~~                      \::/    /                                         \::/    /        
         \/____/                                                        \/____/                                           \/____/         
</code></pre>

## Fun time!

```sh
# multi color
$ grunt ascii:bold:red:yellow:magenta

# rainbow?
$ grunt ascii:rainbow
```

---

<pre><code>
      .___________. __    __       ___      .__   __.  __  ___      _______.
      |           ||  |  |  |     /   \     |  \ |  | |  |/  /     /       |
      `---|  |----`|  |__|  |    /  ^  \    |   \|  | |  '  /     |   (----`
          |  |     |   __   |   /  /_\  \   |  . `  | |    <       \   \
          |  |     |  |  |  |  /  _____  \  |  |\   | |  .  \  .----)   |
          |__|     |__|  |__| /__/     \__\ |__| \__| |__|\__\ |_______/
</code></pre>
