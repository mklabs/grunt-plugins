
task.registerMultiTask 'logstuff', 'This task logs stuff.', ->
  log.writeln @target + ': ' + @data

  log.writeln @target
  log.writeln @data
  log.writeln @name
  log.writeln @args

  log.inspect @flags
  log.data @file
  return false  unless @data
  log.writeln 'Logging stuff succeeded.'

task.registerTask 'coffee-foo', 'A sample task that logs stuff.', (arg1, arg2) ->
  if arguments.length is 0
    log.writeln "#{@name}, no args"
  else
    log.writeln "#{@name}, #{arg1} #{arg2}"

