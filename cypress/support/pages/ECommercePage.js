// cypress/support/pages/ECommercePage.js
// ─────────────────────────────────────────────────────────────────────────────
// Page Object Model for SauceDemo (https://www.saucedemo.com)
// A publicly available e-commerce demo site — matches the checkout/payment
// scenarios in Daniel's portfolio Capstone Project 4.
// ─────────────────────────────────────────────────────────────────────────────

class ECommercePage {
  // ── Selectors ──────────────────────────────────────────────────────────────
  get usernameInput ()    { return cy.get('[data-test="username"]') }
  get passwordInput ()    { return cy.get('[data-test="password"]') }
  get loginButton ()      { return cy.get('[data-test="login-button"]') }
  get loginError ()       { return cy.get('[data-test="error"]') }

  get productList ()      { return cy.get('.inventory_list') }
  get cartIcon ()         { return cy.get('.shopping_cart_link') }
  get cartBadge ()        { return cy.get('.shopping_cart_badge') }
  get cartItems ()        { return cy.get('.cart_item') }

  get checkoutBtn ()      { return cy.get('[data-test="checkout"]') }
  get firstNameField ()   { return cy.get('[data-test="firstName"]') }
  get lastNameField ()    { return cy.get('[data-test="lastName"]') }
  get postalCodeField ()  { return cy.get('[data-test="postalCode"]') }
  get continueBtn ()      { return cy.get('[data-test="continue"]') }
  get finishBtn ()        { return cy.get('[data-test="finish"]') }
  get confirmationHeader () { return cy.get('.complete-header') }
  get sortDropdown ()     { return cy.get('[data-test="product_sort_container"]') }

  productAddBtn (name) {
    return cy.contains('.inventory_item_name', name)
      .closest('.inventory_item')
      .find('button')
  }

  productRemoveBtn (name) {
    return cy.contains('.inventory_item_name', name)
      .closest('.inventory_item')
      .find('button[class*="remove"]')
  }

  // ── Actions ────────────────────────────────────────────────────────────────

  visit () {
    cy.visit(Cypress.env('ECOMMERCE_URL'))
    return this
  }

  login (username = Cypress.env('ECOMMERCE_USER'), password = Cypress.env('ECOMMERCE_PASS')) {
    this.usernameInput.clear().type(username)
    this.passwordInput.clear().type(password)
    this.loginButton.click()
    return this
  }

  addProductToCart (name) {
    this.productAddBtn(name).click()
    return this
  }

  removeProductFromCart (name) {
    this.productRemoveBtn(name).click()
    return this
  }

  openCart () {
    this.cartIcon.click()
    return this
  }

  fillShippingInfo (firstName, lastName, zip) {
    this.firstNameField.type(firstName)
    this.lastNameField.type(lastName)
    this.postalCodeField.type(zip)
    return this
  }

  sortBy (option) {
    // options: 'az', 'za', 'lohi', 'hilo'
    this.sortDropdown.select(option)
    return this
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  assertOnInventoryPage () {
    cy.url().should('include', '/inventory')
    this.productList.should('be.visible')
  }

  assertCartCount (count) {
    if (count === 0) {
      this.cartBadge.should('not.exist')
    } else {
      this.cartBadge.should('have.text', String(count))
    }
  }

  assertOrderConfirmed () {
    this.confirmationHeader.should('contain', 'Thank you for your order!')
  }

  assertLoginError (text) {
    this.loginError.should('be.visible').and('contain', text)
  }
}

module.exports = new ECommercePage()
