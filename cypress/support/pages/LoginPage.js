// cypress/support/pages/LoginPage.js
// ─────────────────────────────────────────────────────────────────────────────
// Page Object Model for OrangeHRM Login Page.
// Encapsulates all selectors and actions so tests don't contain raw CSS.
// ─────────────────────────────────────────────────────────────────────────────

class LoginPage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  get usernameInput ()  { return cy.get('[name="username"]') }
  get passwordInput ()  { return cy.get('[name="password"]') }
  get loginButton ()    { return cy.get('[type="submit"]') }
  get errorMessage ()   { return cy.get('.oxd-alert-content-text') }
  get forgotPassword () { return cy.contains('Forgot your password?') }
  get pageTitle ()      { return cy.get('.orangehrm-login-title') }

  // ── Actions ────────────────────────────────────────────────────────────────

  /**
   * Navigate to the OrangeHRM login page.
   */
  visit () {
    cy.visit(`${Cypress.env('ORANGEHRM_URL')}/web/index.php/auth/login`)
    return this
  }

  /**
   * Type into the username field.
   * @param {string} username
   */
  enterUsername (username) {
    this.usernameInput.clear().type(username)
    return this
  }

  /**
   * Type into the password field.
   * @param {string} password
   */
  enterPassword (password) {
    this.passwordInput.clear().type(password)
    return this
  }

  /**
   * Click the Login button.
   */
  clickLogin () {
    this.loginButton.click()
    return this
  }

  /**
   * Full login flow in one call.
   * @param {string} username
   * @param {string} password
   */
  login (username, password) {
    return this.enterUsername(username).enterPassword(password).clickLogin()
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  assertErrorMessage (text) {
    this.errorMessage.should('be.visible').and('contain', text)
  }

  assertOnLoginPage () {
    cy.url().should('include', '/auth/login')
    this.loginButton.should('be.visible')
  }
}

module.exports = new LoginPage()
