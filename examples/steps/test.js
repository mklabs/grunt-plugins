Given(/I run the init task/, function() {
  // step definition code goes here
});

When(/I go to js/, function(done) {
  // step definition code goes here
  // throw new Error('whaaat');

  console.log(done);
  done();
});

Then(/I should see a "([^"]+)" file/, function(file) {
  // step definition code goes here
  console.log(arguments, this);
  // done();
});

Then (/I should see a vendor directory/, function() {
  // step definition code goes here
});

Given(/I run the build task/, function() {
  // step definition code goes here
});

When(/I go to publish/, function() {
  // step definition code goes here
});

Then(/I should see "index.html" file/, function() {
  // step definition code goes here
});

Given(/there are 240 courses which do not have the topic "biology"/, function() {
  // step definition code goes here
});

Given (/there are 2 courses A001, B205 that each have "biology" as one of the topics/, function() {
  // step definition code goes here
});

When(/I search for "biology"/, function() {
  // step definition code goes here
});

Then(/I should see the following courses:/, function() {
  // step definition code goes here
});

