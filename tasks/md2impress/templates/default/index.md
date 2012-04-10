
## Automating Website Optimizations

* » [Introduction](../)
* [Grunt](../grunt/)
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

## Why use a build tool

* automate the boring repetitive parts
  * (so you can spend more time creating things)

* hard to dev with optimized code (but fast sites are important)

## lots of build tool choices

* (wikipedia list 80+)
* choose the right one

## Ant

```xml
<target name="compile" depends="init"
        description="compile the source " >
    <!-- Compile the java code from ${src} into ${build} -->
    <javac srcdir="${src}" destdir="${build}"/>
  </target>

  <target name="dist" depends="compile"
        description="generate the distribution" >
    <!-- Create the distribution directory -->
    <mkdir dir="${dist}/lib"/>

...

```

---

**Ant**

* ant is right for some
  * doens't make it right for you

* ant is far from respect

## Cake / CoffeeScript

![](http://almaer.com/blog/uploads/Screen-shot-2011-03-31-at-Mar-31-@-7.33.01-PM.png)

## Cake

```cs
fs = require "fs"

option "-o", "--output [DIR]", "directory for compiled code"

task "minify", "Minify the resulting application file after build", ->
  exec "java -jar "/home/stan/public/compiler.jar" --js lib/app.js --js_output_file lib/app.production.js", (err, stdout, stderr) ->
    throw err if err
    console.log stdout + stderr
```

## Rake

![Rake](http://www.ruby-lang.org/images/logo.gif)

* [h5bp/rake build script](https://github.com/h5bp/rake-build-script) (work in
  progress)
* [jammit](http://documentcloud.github.com/jammit/)

## Jake

```js
desc("This is the default task.");
task("default", function (params) {
  console.log("This is the default task.");
});
```

* [GitHub Repository](https://github.com/mde/jake)
* [Cappuccino - introducing-jake-a-build-tool-for-javascript](http://cappuccino.org/discuss/2010/04/28/introducing-jake-a-build-tool-for-javascript/)
* [How to node - http://howtonode.org/intro-to-jake](http://howtonode.org/intro-to-jake)

## Buildy

* [GitHub Repository](https://github.com/mosen/buildy)

```js
new Queue("release version")
    .task("files", ["./js/test1.js", "./js/test2.js"])
    .task("concat")
    .task("jsminify")
    .task("write", { name: "./build/test-min.js" })
    .run();
```

* [Unofficial YUI builder port to node.js](https://github.com/mosen/ybuild)

## Grunt!

* [GitHub Repository](https://github.com/cowboy/grunt)
  * The **new** thing

* [Introducing Grunt](http://weblog.bocoup.com/introducing-grunt/)

* [Getting Started](https://github.com/cowboy/grunt/blob/master/docs/getting_started.md#readme)

#### Grunt

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

## easy optimizations

* js min
* css min
* file cleanup (replace string, such as version)
* concat files

* ant is great at all of those
* grunt is awesome at all of those

### push it further

**That's where things get interresting**

## cache busting with file transform

```html
<link rel="stylesheets" href="file.css">
```

is renamed into

```html
<link rel="stylesheets" href="e207ea1.file.css">
```

#### cache busting

**3 lines of node**

```js
var fs = require("fs"),
  crypto = require("crypto");

var hash = crypto.createHash("md5");
hash.update(fs.readFileSync("./path/to/file.css"));
console.log(hash.digest("hex"));
// >> e207ea1eeb616799f29d679e1fdc2415
```

## remove debugging code

* `console.log`
* `debugger;`
* `...`

## ifdefs like

* code placeholder throughs comments
  * build tool swap code snippets depending on env

```js
// env=prod
// dont try this at home!
while(true) console.log("log all day long!");
// end:prod
```

## That's just the easy stuff

#### prefix relative URLs with CDN

```html
<link rel="stylesheets" href="../4b6cd983.file.css">
```

to

```html
<link rel="stylesheets" href="https://a248.e.akamai.net/youraccount/4b6cd983.file.css">
```

## running your own cdn

*is easy now*

* Amazon S3
* Rackspace Cloudfiles

## Replace imgs with datauri

[CSSEmbed](https://github.com/nzakas/cssembed)

[Jammit](http://documentcloud.github.com/jammit/)

next [h5bp/node-build-script](https://github.com/h5bp/node-build-script)

## CSS sprite generation

but datauris are better :p (fit more or less the same role)

## use DataURIs

**serve IE6 & 7 MHTML**

* CSSEmbed / Jammit will make both
* serve IE6/7 via CC
* Good idea to have a file size limitation
* IE8 has this 32kb limitation anyway, so that may be a good value to choose

---

**serve IE6 & 7 MHTML**

* Consider droping support for ie6/7

* and just go for base-64 encoded img < 32kb

## Going further

* generates appcache manifest
* html minification (kangax' minifier)

## appcache manifest

* [Confess](https://github.com/jamesgpearce/confess)
  * Uses PhantomJS to headlessly analyze web pages and generate manifests.

* Grunt has phantomjs builtin support for headless testing

* Confess in next [h5bp/node-build-script](https://github.com/h5bp/node-build-script)?

<small>[Facts!](http://appcachefacts.info/)</small>

## Basic to Aggressive

**HTML Minification**

With the fantastic [html-minifier](http://kangax.github.com/html-minifier/) from kangax

* [GitHub Repository](https://github.com/kangax/html-minifier)

* [Experimenting with html minifier](http://perfectionkills.com/experimenting-with-html-minifier/)

## Tools and web-build systems

Ant / Make / Rake / Jake / Cake / Grunt / Bash / Python

* [H5BP build scripts](http://html5boilerplate.com/docs/Build-script/) /
[Ant](https://github.com/h5bp/ant-build-script) /
[Node](https://github.com/h5bp/node-build-script) /
[Rake](https://github.com/h5bp/rake-build-script)

* [Buildr](https://github.com/balupton/buildr.npm) /
[Web-Build](https://github.com/tivac/web-build) /
...

## build tools are great

* ✔ **pick one**

* ☺ **configure it once**

* ✌ **use it**

---
<i class="snowman"></i>
---
<i class="heart"></i>
---
<i class="bstar"></i>
---
<i class="wstar"></i>
---
<i class="atom"></i>
---
<i class="tel"></i>
---
<i class="victory"></i>
---

