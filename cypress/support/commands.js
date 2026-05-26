// cypress/support/commands.js
// ─────────────────────────────────────────────────────────────────────────────
// Custom Cypress commands used across all test suites.
// Add reusable actions here so tests stay clean and DRY.
// ─────────────────────────────────────────────────────────────────────────────

// ── OrangeHRM ─────────────────────────────────────────────────────────────────

/**
 * Login to OrangeHRM using credentials from cypress.config.js env vars.
 * Usage: cy.loginToOrangeHRM()
 *        cy.loginToOrangeHRM('Admin', 'admin123')
 */
Cypress.Commands.add('loginToOrangeHRM', (
  username = Cypress.env('ORANGEHRM_USER'),
  password = Cypress.env('ORANGEHRM_PASS')
) => {
  cy.visit(`${Cypress.env('ORANGEHRM_URL')}/web/index.php/auth/login`)
  cy.get('[name="username"]').clear().type(username)
  cy.get('[name="password"]').clear().type(password)
  cy.get('[type="submit"]').click()
})

/**
 * Assert that user is on the OrangeHRM dashboard after login.
 */
Cypress.Commands.add('assertOrangeHRMDashboard', () => {
  cy.url().should('include', '/dashboard')
  cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard')
})

// ── DemoQA ────────────────────────────────────────────────────────────────────

/**
 * Fill a DemoQA practice form field by label text.
 * Usage: cy.fillField('First Name', 'Daniel')
 */
Cypress.Commands.add('fillField', (label, value) => {
  cy.contains('.oxd-label, label', label)
    .closest('.oxd-input-group, .oxd-grid-item, div')
    .find('input, textarea')
    .first()
    .clear()
    .type(value)
})

/**
 * Inject an XSS payload into an input and assert it did NOT execute.
 * Usage: cy.testXSSInput('[data-testid="firstName"]')
 */
Cypress.Commands.add('testXSSInput', (selector, payload = '<script>window.__xss=true</script>') => {
  cy.get(selector).clear().type(payload)
  cy.get(selector).invoke('val').should('exist')
  // Assert the script tag was NOT executed
  cy.window().its('__xss').should('eq', undefined)
})

// ── E-Commerce (SauceDemo) ────────────────────────────────────────────────────

/**
 * Login to SauceDemo.
 * Usage: cy.loginToSauceDemo()
 *        cy.loginToSauceDemo('locked_out_user', 'secret_sauce')
 */
Cypress.Commands.add('loginToSauceDemo', (
  username = Cypress.env('ECOMMERCE_USER'),
  password = Cypress.env('ECOMMERCE_PASS')
) => {
  cy.visit(Cypress.env('ECOMMERCE_URL'))
  cy.get('[data-test="username"]').clear().type(username)
  cy.get('[data-test="password"]').clear().type(password)
  cy.get('[data-test="login-button"]').click()
})

/**
 * Add a product to cart by its name.
 * Usage: cy.addToCart('Sauce Labs Backpack')
 */
Cypress.Commands.add('addToCart', (productName) => {
  cy.contains('.inventory_item_name', productName)
    .closest('.inventory_item')
    .find('button')
    .click()
})

/**
 * Assert cart badge count.
 * Usage: cy.assertCartCount(2)
 */
Cypress.Commands.add('assertCartCount', (count) => {
  if (count === 0) {
    cy.get('.shopping_cart_badge').should('not.exist')
  } else {
    cy.get('.shopping_cart_badge').should('have.text', String(count))
  }
})

/**
 * Complete checkout flow on SauceDemo.
 * Usage: cy.completeCheckout('Daniel', 'Afolabi', '12345')
 */
Cypress.Commands.add('completeCheckout', (firstName, lastName, zip) => {
  cy.get('.shopping_cart_link').click()
  cy.get('[data-test="checkout"]').click()
  cy.get('[data-test="firstName"]').type(firstName)
  cy.get('[data-test="lastName"]').type(lastName)
  cy.get('[data-test="postalCode"]').type(zip)
  cy.get('[data-test="continue"]').click()
  cy.get('[data-test="finish"]').click()
})
