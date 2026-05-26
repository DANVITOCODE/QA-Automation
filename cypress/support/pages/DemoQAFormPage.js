// cypress/support/pages/DemoQAFormPage.js
// ─────────────────────────────────────────────────────────────────────────────
// Page Object Model for the DemoQA Automation Practice Form.
// URL: https://demoqa.com/automation-practice-form
// ─────────────────────────────────────────────────────────────────────────────

class DemoQAFormPage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  get firstNameInput ()   { return cy.get('#firstName') }
  get lastNameInput ()    { return cy.get('#lastName') }
  get emailInput ()       { return cy.get('#userEmail') }
  get mobileInput ()      { return cy.get('#userNumber') }
  get submitButton ()     { return cy.get('#submit') }
  get successModal ()     { return cy.get('.modal-content') }
  get successTitle ()     { return cy.get('#example-modal-sizes-title-lg') }

  genderRadio (gender)    { return cy.get(`[value="${gender}"]`) }

  // ── Actions ────────────────────────────────────────────────────────────────

  visit () {
    cy.visit(`${Cypress.env('DEMOQA_URL')}/automation-practice-form`)
    // Remove adverts that can block clicks
    cy.document().then(doc => {
      const ad = doc.querySelector('#fixedban')
      if (ad) ad.remove()
      const footer = doc.querySelector('footer')
      if (footer) footer.remove()
    })
    return this
  }

  fillFirstName (name) {
    this.firstNameInput.clear().type(name)
    return this
  }

  fillLastName (name) {
    this.lastNameInput.clear().type(name)
    return this
  }

  fillEmail (email) {
    this.emailInput.clear().type(email)
    return this
  }

  fillMobile (number) {
    this.mobileInput.clear().type(number)
    return this
  }

  selectGender (gender = 'Male') {
    // Use force:true because the radio input is hidden behind a styled label
    this.genderRadio(gender).check({ force: true })
    return this
  }

  submit () {
    this.submitButton.click()
    return this
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  assertSubmitSuccess () {
    this.successModal.should('be.visible')
    this.successTitle.should('contain', 'Thanks for submitting the form')
  }

  assertFieldIsRequired (selector) {
    cy.get(selector).should('have.class', 'field-error').or('have.attr', 'required')
  }
}

module.exports = new DemoQAFormPage()
