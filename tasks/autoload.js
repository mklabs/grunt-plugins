

var fs = require('fs'),
  path = require('path');

fs.readdirSync(__dirname).forEach(function(f) {
  var filepath = path.join(__dirname, f);

  if(!fs.statSync(filepath).isDirectory()) return;
  if(f === 'init') return;

  // require the tasks
  require('./' + f);
});
