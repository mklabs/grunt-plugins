Feature: Install repo
  As a lazy developper
  I want to fetch a given repo
  So that I can start right away

  Scenario: grunt-template h5bp/html5-boilerplate
    Given I run "grunt-template h5bp/html5-boilerplate"
    And I answer to a bunch of prompt
    When the "end" event is triggered
    Then the outcome should be "test/fixtures/h5bp":q


