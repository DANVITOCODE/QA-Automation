// cypress/e2e/demoqa/demoqa-form.cy.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite: DemoQA Practice Form — Validation & Security Testing
// App URL:    https://demoqa.com/automation-practice-form
// Covers:     All issues documented in Portfolio Project 3 (Exploratory Testing)
// ─────────────────────────────────────────────────────────────────────────────

import DemoQAFormPage from '../../support/pages/DemoQAFormPage'

describe('DemoQA — Practice Form Validation & Security', () => {
  let testData

  before(() => {
    cy.fixture('testData').then(data => { testData = data })
  })

  beforeEach(() => {
    DemoQAFormPage.visit()
  })

  // ── Happy Path ─────────────────────────────────────────────────────────────

  context('Happy Path — Valid Form Submission', () => {

    it('Submits successfully with all required fields filled', () => {
      const user = testData.demoQAUser

      DemoQAFormPage
        .fillFirstName(user.firstName)
        .fillLastName(user.lastName)
        .fillEmail(user.email)
        .selectGender(user.gender)
        .fillMobile(user.mobile)
        .submit()

      DemoQAFormPage.assertSubmitSuccess()
    })

  })

  // ── Input Validation Tests ─────────────────────────────────────────────────

  context('Input Validation', () => {

    it('Rejects submission when required fields are empty', () => {
      // Submit with nothing filled — required fields should highlight
      DemoQAFormPage.submit()

      // At minimum, first name, last name, gender, mobile should be invalid
      cy.get('.was-validated input:invalid, input.field-error, [class*="error"]')
        .should('exist')

      // Should NOT show success modal
      DemoQAFormPage.successModal.should('not.exist')
    })

    it('Email field rejects invalid format', () => {
      // Type an email without the @ symbol
      DemoQAFormPage
        .fillFirstName('Daniel')
        .fillLastName('Afolabi')
        .fillEmail('invalidemail.com') // missing @
        .selectGender('Male')
        .fillMobile('9137678788')
        .submit()

      // Email field should be marked invalid
      cy.get('#userEmail').should('have.class', 'mr-sm-2 field-error').or(() => {
        cy.get('#userEmail').invoke('val').should('not.be.empty')
        cy.get('#userEmail').closest('div').should('have.css', 'border-color')
      })
    })

    it('Mobile number field rejects non-numeric input', () => {
      DemoQAFormPage.fillMobile('abcdefghij')

      // The field should either reject non-numeric input or show an error on submit
      DemoQAFormPage
        .fillFirstName('Daniel')
        .fillLastName('Afolabi')
        .selectGender('Male')
        .submit()

      DemoQAFormPage.successModal.should('not.exist')
    })

    it('Mobile number field enforces 10-digit length', () => {
      // Enter only 5 digits — should fail validation
      DemoQAFormPage
        .fillFirstName('Daniel')
        .fillLastName('Afolabi')
        .selectGender('Male')
        .fillMobile('12345') // too short
        .submit()

      DemoQAFormPage.successModal.should('not.exist')
    })

  })

  // ── Boundary & Edge Case Tests ─────────────────────────────────────────────

  context('Boundary & Edge Case Tests', () => {

    it('Handles special characters in name fields', () => {
      // Special characters should not crash the form or behave unexpectedly
      DemoQAFormPage
        .fillFirstName('@#$%!')
        .fillLastName('Test')
        .fillEmail('test@example.com')
        .selectGender('Male')
        .fillMobile('9137678788')

      // Assert the field accepted the input (even if we'd want it rejected in a real app)
      cy.get('#firstName').invoke('val').should('equal', '@#$%!')
    })

    it('Handles extremely long input in name fields (1000+ characters)', () => {
      const longString = 'a'.repeat(1000)

      DemoQAFormPage.fillFirstName(longString)

      // The form should not crash or freeze
      cy.get('#firstName').should('exist')
      cy.get('body').should('be.visible')
    })

    it('Handles paste input (not just keyboard typing)', () => {
      // Simulate pasting text into first name field
      cy.get('#firstName').invoke('val', 'PastedName').trigger('input')
      cy.get('#firstName').invoke('val').should('equal', 'PastedName')
    })

  })

  // ── Security Tests (XSS) ──────────────────────────────────────────────────

  context('Security Tests — XSS Prevention (Critical from Exploratory Testing)', () => {

    it('XSS script injection in First Name does not execute', () => {
      // This was a CRITICAL finding in the exploratory testing session
      // The script must not execute — window.__xss should remain undefined
      cy.testXSSInput('#firstName')
      cy.window().its('__xss').should('eq', undefined)
    })

    it('XSS script injection in Last Name does not execute', () => {
      cy.testXSSInput('#lastName')
      cy.window().its('__xss').should('eq', undefined)
    })

    it('HTML injection in name field is not rendered as HTML', () => {
      const htmlPayload = '<img src=x onerror="window.__xss=true">'

      cy.get('#firstName').type(htmlPayload)

      // The onerror should not fire — value should be treated as text, not HTML
      cy.window().then(win => {
        expect(win.__xss).to.equal(undefined)
      })
    })

  })

  // ── Network Resilience Tests ───────────────────────────────────────────────

  context('Network & Error Handling', () => {

    it('Multiple rapid submit clicks do not cause duplicate submissions', () => {
      DemoQAFormPage
        .fillFirstName('Daniel')
        .fillLastName('Afolabi')
        .fillEmail('daniel@example.com')
        .selectGender('Male')
        .fillMobile('9137678788')

      // Click submit multiple times rapidly
      DemoQAFormPage.submitButton.click()
      DemoQAFormPage.submitButton.click()
      DemoQAFormPage.submitButton.click()

      // Only one success modal should appear (not multiple stacked modals)
      cy.get('.modal-content').should('have.length', 1)
    })

  })

})
