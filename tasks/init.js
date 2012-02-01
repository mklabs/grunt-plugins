/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */


// tiny override of the built-in prompt_for helper to not throw with
// prompt name not in defaults or known in the prompts hash.

// Commonly-used prompt options with meaningful default values.
task.registerHelper('prompt_for', function(name, alternateDefault) {
  // Clone the option so the original options object doesn't get modified.
  var prompts = task.helper('prompt_for_obj');

  var option = underscore.clone(prompts[name]) || {};
  option.name = name;

  // An alternate default was specified, so use it.
  option.default = alternateDefault;

  return option;
});

