var assert = require('assert');

module.exports = {
  before: function(){
    // ...
  },

  'Array': {
    '#indexOf()': {
      'should return -1 when not present': function(){
        // [1,2,3].indexOf(4).should.equal(-1);
        assert.ok([1,2,3].indexOf(4) === -1);
      }
    }
  }
};
