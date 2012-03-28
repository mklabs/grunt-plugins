
var load = require('./load'),
  use = require('./use');

module.exports = gruntFlavored;

//
// Grunt flavored - grunt with spicy API
//

// to be put into a grunt-flavored plugin
//
// Adds a few thing to the grunt api
//
// 1. A flatiron like .use method
// 2. A special load method, doing VM trickery do cool things
// 3. Example of overriding the log object
// 4. Few more useful stuff
//
function gruntFlavored(g, o) {
  o = o || {};
  g = g || require('grunt');

  // todo grunt safety check

  // extend grunt with a `.use` method
  g.use = use.bind(g);

  // and use `use` to extend grunt

  // vm fun time
  g.use(load);

  return g;
}
