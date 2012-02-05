

exports.foo = {
  'should be': function(test) {
    test.expect(1);
    test.equal('good', 'goods');
    
    test.done();
  }
};
