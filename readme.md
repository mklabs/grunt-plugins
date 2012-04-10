# grunt-impress

Reads markdown, Generates a basic impress.js presentation

## Getting Started

Install this grunt plugin next to your project's [grunt.js
gruntfile][getting_started] with: `npm install grunt-impress`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
task.loadNpmTasks('grunt-impress');
```

## Usage

```sh
cat presentation.md | grunt impress
```

This task is "stream-aware", eg. it should be usable in a unix-like way
and be composable / pipable.

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

* **end**: when the stream is done doing its thing writes stuff, usually happening when piped to a
  destination stream.

## Options

* **template** (optional) when specified, use this file template to render the
  final presentation

```sh
$ cat prez.md | grunt impress --template basic.html
```

## Release History

* **0.1.0** Birthday!

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md
