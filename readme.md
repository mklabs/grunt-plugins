
# grunt-plugins

Collection of growing Grunt plugins and utilities

_I'll probably create a **bunch** of grunt plugins. Instead of creating a new
repo for each one, this repository keeps track of these._

## Description

The `master` branch is my actual "grunt user dir" (`~/.grunt/` on poxis,
`%USERPROFILE/.grunt/` on windows) and keeps track of additional tasks, plugins
and init templates I use in my setup.

Each plugin has it's own repo, and is managed in a separate branch. This is very
much like if they were managed each in their own repository (thanks to npm's
ability to express dependencies with giturl or tarball)

* Most will be total crap.

* Some may be useful.

* Some may be published to npm.

For further information on plugins configuration / usage, explore the branches
and navigate through the repository, each plugin should have its own
documentation (even a very basic one)

## How it works

The master `branch` is defining a basic package.json, with dependencies to each
of the grunt plugins that are used.

They may or may not be in npm's repository. In either case, `npm install` will
work the same.

## Install

```sh
$ git clone git@github.com:mklabs/grunt-plugins.git ~/.grunt
$ cd ~/.grunt/
$ npm install
$ grunt --help
```

## Plugins

* **[grunt-help][]**: Get help on grunt. A task to add some help output ability to
  grunt built-in tasks, or your own one. Has support for browser, man and stdout viewers.

* **[grunt-impress][]**: Generates impress.js presentation from raw markdown files

* **[grunt-fetch][]**: A simple task to fetch a given github repository into a
  local folder. Project tarball is downloaded / unziped / untared to a local
  folder, in a single raw stream.

[grunt-help]: https://github.com/mklabs/grunt-plugins/tree/grunt-help
[grunt-impress]: https://github.com/mklabs/grunt-plugins/tree/grunt-impress
[grunt-fetch]: https://github.com/mklabs/grunt-plugins/tree/grunt-fetch
