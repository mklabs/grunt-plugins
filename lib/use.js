
module.exports = use;

//
// **use** attachs the plugin with the specific name to this `grunt` object.
//
function use(plugin, options) {
  options = options || {};

  var grunt = this;

  // setup necessary props, needs precheck before overriding something that
  // might exists or be introduced natively in grunt
  grunt.plugins = grunt.plugins || {};
  grunt.options = grunt.options || {};

  var name = plugin.name || uuid();

  // setup state of this plugin to the grunt object
  grunt.plugins[name] = plugin;
  grunt.options[name] = options;

  // attach passed in plugin to the grunt object, extending it with new
  // functionality.
  if(plugin.attach && options.attach !== 'false') plugin.attach.call(grunt, options);

  // might add init step, not necessary now
  // ...

  // chainable api thing
  return grunt;
}


//
// **uuid** is a basic "unique ID" generator for cases when `plugin.name` is
// undefined
//
function uuid() {
  var id = uuid.id || (uuid.id = 0);
  return 'plugin-' + (++id);
}
