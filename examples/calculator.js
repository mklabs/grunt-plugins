module.exports = Calculator;
function Calculator() {
  this.args = [];
}

Calculator.prototype.push = function(n) {
  this.args.push(typeof n === 'string' ? parseFloat(n) : n);
};

Calculator.prototype.sum = function() {
  return this.args.reduce(function(a, b) {
    return a + b;
  });
};
