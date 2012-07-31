var assert = require('assert'),
  ok = assert.ok.bind(assert);

suite('Array');

test('#length', function(){
  var arr = [1,2,3];
  ok(arr.length == 3);
});

test('#indexOf()', function(){
  var arr = [1,2,3];
  ok(arr.indexOf(1) === 0);
  ok(arr.indexOf(2) === 1);
  ok(arr.indexOf(3) === 2);
});

suite('String');

test('#length', function(){
  ok('foo'.length === 3);
});
