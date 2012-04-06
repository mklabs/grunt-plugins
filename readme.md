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

## Usage

    $ grunt help
    Usage:
     grunt help
     grunt help:page

    Pages:
     » grunt help:api
     » grunt help:api_config
     » grunt help:api_fail
     » grunt help:api_file
     » grunt help:api_log
     » grunt help:api_task
     » grunt help:api_template
     » grunt help:api_utils
     » grunt help:contributing
     » grunt help:example_gruntfiles
     » grunt help:exit_codes
     » grunt help:faq
     » grunt help:getting_started
     » grunt help:helpers_directives
     » grunt help:plugins
     » grunt help:README
     » grunt help:task_concat
     » grunt help:task_init
     » grunt help:task_lint
     » grunt help:task_min
     » grunt help:task_qunit
     » grunt help:task_server
     » grunt help:toc
     » grunt help:types_of_tasks

    $ npm config get viewer
    man

    $ grunt help:api
    GRUNT-API.MD(1)                                                                 GRUNT-API.MD(1)

    NAME
           grunt-api.md -- documentation for api.md

           Grunt  homepage https://github.com/cowboy/grunt | Documentation table of contents toc.md
           Grunt exposes all of its methods and properties on the grunt object that gets passed into the
           ...

    $ npm config set viewer browser
    Running "help:api" (help) task

    Opening https://github.com/cowboy/grunt/blob/master/docs/api.md#readme in default browser: open

