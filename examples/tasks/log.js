

task.registerTask('log', 'Dummy task, testing things', function() {
  log
    .writeln('Testing things with something')
    .writeln('that looks like grunt 0.2.x api')
    .writeln('But no.. This is grunt 0.3.5');
});
