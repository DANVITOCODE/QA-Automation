const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Base URLs are set per-suite via env vars or directly in page objects
    // so we can support multiple apps in one project
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/commands.js',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 8000,
    pageLoadTimeout: 30000,
    retries: {
      runMode: 1,   // retry once in CI
      openMode: 0   // no retries when developing locally
    },
    reporter: 'mochawesome',
    reporterOptions: {
      reportDir: 'cypress/reports',
      overwrite: false,
      html: true,
      json: true
    },
    env: {
      // OrangeHRM
      ORANGEHRM_URL: 'https://opensource-demo.orangehrmlive.com',
      ORANGEHRM_USER: 'Admin',
      ORANGEHRM_PASS: 'admin123',

      // DemoQA
      DEMOQA_URL: 'https://demoqa.com',

      // E-Commerce (SauceDemo — free public demo site)
      ECOMMERCE_URL: 'https://www.saucedemo.com',
      ECOMMERCE_USER: 'standard_user',
      ECOMMERCE_PASS: 'secret_sauce',
      ECOMMERCE_LOCKED_USER: 'locked_out_user'
    }
  }
})
