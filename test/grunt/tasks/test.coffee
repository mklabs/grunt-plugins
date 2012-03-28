
assert = require('assert')

task.registerTask 'coffee-flavored', 'Dummy task, testing things', ->
  log.writeln('Testing things with something').writeln('that looks like grunt 0.2.x api').writeln 'But no.. This is grunt 0.3.5'

config 'coffee-logstuff',
  foo: [ 1, 2, 3 ]
  bar: "hello world"

task.registerMultiTask 'coffee-logstuff', 'This task logs stuff.', ->
  log.writeln @target + ': ' + @data
  assert.ok @target
  assert.ok @data
  assert.ok @name
  assert.ok @args
  assert.ok @flags
  assert.ok @file
  return false  unless @data
  log.writeln 'Logging stuff succeeded.'

task.registerTask 'coffee-foo', 'A sample task that logs stuff.', (arg1, arg2) ->
  if arguments.length is 0
    log.writeln "#{@name}, no args"
  else
    log.writeln "#{@name}, #{arg1} #{arg2}"

