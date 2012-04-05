# grunt-help

Get help on grunt

## Getting Started

Install this grunt plugin next to your project's [grunt.js
gruntfile][getting_started] with: `npm install grunt-help`

Then add this line to your project's `grunt.js` gruntfile:

```javascript
grunt.task.loadNpmTasks('grunt-help');
```

[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Documentation

A significant amount of effort have been put into setting up a comprehensive
and most excellent documentation on grunt usage, tasks and API.

     https://github.com/cowboy/grunt/blob/master/docs/toc.md

This task embraces this shiny new docs to provide an handy `grunt help`
task.

It takes term to search for an appropriate page in the grunt docs. A
term should match a doc page, minus extension. Alternately, many term
could be provided, such as `help:api:config` which is the equivalent of
using `help:api_config`.

### Configuration

In your gruntfile:

    ...
    viewer: 'man', // or browser, or stdout.
    browser: 'open', // or google-chrome
    ...

If either viewer or browser are not set in grunt config, then npm config
values are used instead.

    $ npm config get viewer
    $ npm config set viewer browser

    $ npm config get browser
    $ npm config set browser google-chrome

Possible values for `viewer` are: man, browser or stdout.

**browser**

When `viewer=browser`, then the `browser` config value is used to open the
appropriate HTML page in your browser.

**man**

When `viewer=man`, then the documentation is displayed as manpage. The
conversion is done directly from markdown files (in grunt installed
location, either it is locally or globally), thanks to @kapouer's
[ronnjs](https://github.com/kapouer/ronnjs#readme) and dipslayed via man
executable.

**stdout**

When `viewer=stdout`, the documentation content is displayed directly in
the console, in its raw format - markdown.

