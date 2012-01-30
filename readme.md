
Collection of custom [grunt](https://github.com/cowboy/grunt) and
scaffolding templates.

### install

    git clone git://github.com/mklabs/gruntfiles.git ~/.grunt


### description

Grunt has this really nice feature when it scans for any use related
tasks, and location. It's maybe not really well documented yet, but it's
kinda hot if you ask me.

It's like dotfiles but for grunt.

It'll include any tasks in `~/.grunt/tasks`. Any files put in there might
override built-in tasks or create new custom one.

In addition to that, grunt has this special `init` task that can be used
to setup a variety of scaffolding use case. It'll also scan the
`~/.grunt/tasks/init` folder to lookup any valid templates.

I'll be using this repo to manage my collection of grunt custom tasks,
and scaffolding templates.


