Feature: Build script
  In order to run the script
  As a user
  I want to create an app and trigger a build

  Scenario: Init app
    Given I run the init task
    When I go to js
    Then I should see a "main.js" file
    And I should see a vendor directory

  Scenario: Build script
    Given I run the build task
    When I go to publish
    Then I should see "index.html" file

