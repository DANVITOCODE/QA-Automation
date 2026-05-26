// cypress/e2e/login/orangehrm-login.cy.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite: OrangeHRM Login Functionality
// App URL:    https://opensource-demo.orangehrmlive.com
// Covers:     TC_FT_01, TC_FT_02, TC_FT_03, TC_NFT_02 from Portfolio Project 1
// ─────────────────────────────────────────────────────────────────────────────

import LoginPage from '../../support/pages/LoginPage'

describe('OrangeHRM — Login Functionality', () => {
  // Load test data from fixtures so credentials aren't hardcoded in tests
  let testData

  before(() => {
    cy.fixture('testData').then(data => { testData = data })
  })

  beforeEach(() => {
    // Start each test from a clean login page
    LoginPage.visit()
  })

  // ── Functional Tests ───────────────────────────────────────────────────────

  context('Functional Tests', () => {

    it('TC_FT_01 — Valid credentials redirect to dashboard', () => {
      // This is the happy path — valid user should reach the dashboard
      LoginPage.login(testData.validUser.username, testData.validUser.password)

      cy.url().should('include', '/dashboard')
      cy.get('.oxd-topbar-header-breadcrumb').should('contain', 'Dashboard')
    })

    it('TC_FT_02 — Invalid password shows error message', () => {
      // Wrong password should show an error — not silently fail
      LoginPage
        .enterUsername(testData.validUser.username)
        .enterPassword('wrongpassword')
        .clickLogin()

      LoginPage.assertErrorMessage('Invalid credentials')
      cy.url().should('include', '/auth/login') // user stays on login page
    })

    it('TC_FT_03 — Empty fields show required validation', () => {
      // Clicking login with no input should show field-level validation
      LoginPage.clickLogin()

      cy.get('.oxd-input-field-error-message')
        .should('have.length.at.least', 2)
        .each($el => {
          cy.wrap($el).should('contain', 'Required')
        })
    })

    it('TC_FT_04 — Empty username only shows validation on username field', () => {
      LoginPage
        .enterPassword(testData.validUser.password)
        .clickLogin()

      cy.get('.oxd-input-field-error-message').should('contain', 'Required')
    })

    it('TC_FT_05 — Empty password only shows validation on password field', () => {
      LoginPage
        .enterUsername(testData.validUser.username)
        .clickLogin()

      cy.get('.oxd-input-field-error-message').should('contain', 'Required')
    })

    it('TC_FT_06 — Wrong username shows invalid credentials error', () => {
      LoginPage.login('nonexistentuser', testData.validUser.password)
      LoginPage.assertErrorMessage('Invalid credentials')
    })

  })

  // ── Security Tests ─────────────────────────────────────────────────────────

  context('Security Tests (TC_NFT_02)', () => {

    it('SQL injection in username field is rejected safely', () => {
      // The system must not crash or authenticate when SQL injection is attempted
      LoginPage
        .enterUsername("' OR '1'='1")
        .enterPassword('anything')
        .clickLogin()

      // Should NOT be redirected to dashboard
      cy.url().should('include', '/auth/login')
      // Should show an error, not a blank page or crash
      cy.get('body').should('not.be.empty')
      LoginPage.assertErrorMessage('Invalid credentials')
    })

    it('SQL injection in password field is rejected safely', () => {
      LoginPage
        .enterUsername(testData.validUser.username)
        .enterPassword("' OR 1=1--")
        .clickLogin()

      cy.url().should('include', '/auth/login')
      LoginPage.assertErrorMessage('Invalid credentials')
    })

    it('Multiple injection payloads are all rejected', () => {
      // Loop through all known SQL injection payloads
      testData.sqlInjectionPayloads.forEach(payload => {
        LoginPage.visit()
        LoginPage.login(payload, payload)
        cy.url().should('include', '/auth/login')
      })
    })

  })

  // ── Performance Test ───────────────────────────────────────────────────────

  context('Performance Tests (TC_NFT_01)', () => {

    it('Successful login completes within 5 seconds', () => {
      const start = Date.now()

      LoginPage.login(testData.validUser.username, testData.validUser.password)

      cy.url().should('include', '/dashboard').then(() => {
        const elapsed = Date.now() - start
        expect(elapsed).to.be.lessThan(5000, `Login took ${elapsed}ms — expected under 5000ms`)
      })
    })

  })

  // ── UI / UX Tests ──────────────────────────────────────────────────────────

  context('UI Tests', () => {

    it('Login page displays all required elements', () => {
      LoginPage.usernameInput.should('be.visible')
      LoginPage.passwordInput.should('be.visible')
      LoginPage.loginButton.should('be.visible')
      LoginPage.forgotPassword.should('be.visible')
    })

    it('Password field masks input (type=password)', () => {
      LoginPage.passwordInput.should('have.attr', 'type', 'password')
    })

    it('Username field is focused on page load', () => {
      // Good UX — cursor should be in the username field immediately
      LoginPage.usernameInput.should('be.focused')
    })

  })

})
