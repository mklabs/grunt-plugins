
var path = require('path'),
  spawn = require('child_process').spawn,
  Ronn = require('ronn').Ronn,
  gh = require('gh-fetch');

module.exports = function(grunt) {

  grunt.task.registerInitTask('help', 'Get help on grunt', function(term) {
    var cb = this.async(),
      term = Array.prototype.slice.call(arguments).join('_');

    if(path.existsSync(path.join(__dirname, 'docs'))) return task.helper('help', term, cb);

    var fetch = gh.fetch(['cowboy/grunt', 'docs/*.md'], { whereto: __dirname }, function(err) {
      if(err) return fail.warn(err, 3);
      task.helper('help', term, cb)
    });

    fetch
      .on('start', function(urls, ln) {
        log.subhead('Fetching ' + ln + ' file' + (ln > 1 ? 's': '') + " from grunt's repo...");
      })
      .on('end', function() {
        verbose.writeln('End downloading files');
        verbose.or.ok();
      })
      .on('download', function(url) {
        verbose.writeln('Downloading ' + url + '...');
      })
      .on('downloaded', function(url) {
        verbose.ok('Downloaded ' + url + '...');
        verbose.or.write('.'.green);
      });

  });

  grunt.task.registerHelper('help', function(term, cb) {

    var files = file.expand(path.join(__dirname, 'docs/*.md')),
      pages = files.map(function(f) {
        return path.basename(f).replace(path.extname(f), '');
      });

    var page = files.filter(function(f) {
      return path.basename(f) === term + path.extname(f);
    })[0];

    if(!page) {
      log.error('Unable to find related page for ' + term + '. Valid terms are: ' + log.wordlist(pages, '\n'));
      if(term) return cb(false);

      log.writeln('Would you like to open the toc page instead?');
      return task.helper('prompt', [task.helper('prompt_for', 'toc', 'Y/n')], function(err, props) {
        if(err) return fail.warn(err, 3);
        if(/y/i.test(props.toc)) return task.helper('man', path.join(__dirname, 'docs/toc.md'), cb);
        cb(false);
      });
    }

    task.helper('man', page, cb);
  });


  grunt.task.registerHelper('man', function(filepath, cb) {
    var content = file.read(filepath);

    content = [
      "grunt-:page(1) -- documentation for :page",
      "==========================================================================================================",
      "",
      "---",
      content
    ].join('\n').replace(/:page/g, path.basename(filepath));

    var ronn = new Ronn(content).roff(),
      manpath = path.join(path.dirname(filepath), '.tmp.man');

    file.write(manpath, ronn);
    spawn('man', [manpath], { customFds: [0, 1, 2] }).on('exit', cb);

  });

};

