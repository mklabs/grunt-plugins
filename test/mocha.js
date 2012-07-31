
var assert = require('assert');

describe('Array', function(){
  before(function(){
    // ...
  });

  describe('#indexOf()', function(){
    it('should return -1 when not present', function(){
      assert.ok([1,2,3].indexOf(4) === -1);
    });
  });
});
