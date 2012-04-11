# grunt-impress

Reads markdown, Generates a basic impress.js presentation

## Usage

```sh
cat presentation.md | grunt impress
```

This task is "stream-aware", eg. it should be usable in a unix-like way
and be composable / pipable.

* Slides are delimited by any level of heading / an hr element (`---`).

* Snippets of code are automatically highlighted through
[highlight.js](https://github.com/isagalaev/highlight.js)

## Install

Install this grunt plugin next to your project's [grunt.js
gruntfile][getting_started] with:

```sh
$ npm install grunt-impress`
```

Then add this line to your project's `grunt.js` gruntfile:

```javascript
task.loadNpmTasks('grunt-impress');
```

It'll make the tasks available in your grunt setup, so that `grunt impress`
becomes available.

## API

```javascript
var impress = new Impress(text, options);

impress.on('end', function() {
  console.log('Done generating.');
});

impress.on('error', function(err) {
  // error handling
  console.error(err);
  ...
});

// pipe to destination
impress.pipe(process.stdout);
```

* **text** raw markdown content
* **options** Optional Hash configuration

More options will be added here. Convenient way to add options per slides,
directly in markdown content is planned (to setup impressjs attributes)

`Impress` is a Stream object, and triggers the following events:

* **ready**: when the `Impress` stream is ready for processing (eg. templates
  are resolved)

* **data**: when the stream writes stuff, usually happening when piped to a
  destination stream.

* **end**: when the stream is done doing its thing writes stuff, usually
  happening when piped to a destination stream.

## Options

* **template** (optional) when specified, use this file template to render the
  final presentation

```sh
$ cat prez.md | grunt impress --template basic.html
```

Templates are underscore template, with default interpolation values, and they
must implement something like the following snippet:

```html
<div id="impress">

  <% _.each(sections, function(section) { %>
  <section class="step slide" <%= section.attributes %>>
    <%= section.html %>
  </section>
  <% }); %>;
</div>
```

Templates are given a list of section to work with, each containing:

* **attributes**
string of computed impressjs attributes (`data-x`, `data-y`,
etc.). They're auto-generated, but they can safely be omitted if you'd like full
control over the presentation (and still rely on markdown for the slides'
content)

* **html**
html generated from a section markdown content.

**title**
Maps the text value of first heading element.

## Release History

* **0.1.0** Birthday!

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
