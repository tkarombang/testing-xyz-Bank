const { defineConfig } = require("cypress");

module.exports = defineConfig({
  component: {
    // component options here
  },

  component: {
    devServer: {
      framework: "angular",
      bundler: "webpack",
    },
    specPattern: "**/*.cy.ts",
  },

  e2e: {
    baseUrl: 'https://www.globalsqa.com/angularJs-protractor/BankingProject/#/login',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
