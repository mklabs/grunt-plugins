var vows = require('vows'),
  assert = require('assert'),
  {%= name %} = require('../');

vows.describe("{%= subject %}").addBatch({
  "{%= context %}": {
    topic: function() {},

    "{%= vows %}": function (topic) {

    }
  }
}).export(module);