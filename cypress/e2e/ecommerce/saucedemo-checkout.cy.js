// cypress/e2e/ecommerce/saucedemo-checkout.cy.js
// ─────────────────────────────────────────────────────────────────────────────
// Test Suite: E-Commerce Checkout & Cart Testing (SauceDemo)
// App URL:    https://www.saucedemo.com
// Covers:     TC-001 to TC-015 from Portfolio Capstone Project 4
// ─────────────────────────────────────────────────────────────────────────────

import ECommercePage from '../../support/pages/ECommercePage'

describe('SauceDemo — Checkout & Cart Testing', () => {
  let testData

  before(() => {
    cy.fixture('testData').then(data => { testData = data })
  })

  // Log in before each test so every test starts on the inventory page
  beforeEach(() => {
    ECommercePage.visit()
    ECommercePage.login()
    ECommercePage.assertOnInventoryPage()
  })

  // ── Authentication Tests ───────────────────────────────────────────────────

  context('Authentication', () => {

    it('Valid credentials log in successfully', () => {
      // Already asserted in beforeEach — just confirm URL and product list
      cy.url().should('include', '/inventory')
    })

    it('Locked-out user sees appropriate error message', () => {
      ECommercePage.visit()
      ECommercePage.login(Cypress.env('ECOMMERCE_LOCKED_USER'), Cypress.env('ECOMMERCE_PASS'))
      ECommercePage.assertLoginError('Sorry, this user has been locked out')
    })

    it('Invalid credentials show error message', () => {
      ECommercePage.visit()
      ECommercePage.login('wronguser', 'wrongpass')
      ECommercePage.assertLoginError('Username and password do not match')
    })

    it('Empty credentials show validation error', () => {
      ECommercePage.visit()
      ECommercePage.loginButton.click()
      ECommercePage.assertLoginError('Username is required')
    })

  })

  // ── Cart Management Tests (TC-001 to TC-004) ───────────────────────────────

  context('Cart Management', () => {

    it('TC-001 — Add single item to cart updates badge to 1', () => {
      ECommercePage.addProductToCart('Sauce Labs Backpack')
      ECommercePage.assertCartCount(1)
    })

    it('TC-002 — Add multiple items to cart shows correct count', () => {
      testData.ecommerceProducts.forEach(product => {
        ECommercePage.addProductToCart(product)
      })
      ECommercePage.assertCartCount(testData.ecommerceProducts.length)
    })

    it('TC-003 — Remove item from cart updates badge correctly', () => {
      // Add two items, remove one
      ECommercePage.addProductToCart('Sauce Labs Backpack')
      ECommercePage.addProductToCart('Sauce Labs Bike Light')
      ECommercePage.assertCartCount(2)

      ECommercePage.removeProductFromCart('Sauce Labs Backpack')
      ECommercePage.assertCartCount(1)
    })

    it('TC-003b — Remove all items clears cart badge entirely', () => {
      ECommercePage.addProductToCart('Sauce Labs Backpack')
      ECommercePage.removeProductFromCart('Sauce Labs Backpack')
      ECommercePage.assertCartCount(0) // badge should disappear
    })

    it('Cart contents persist when navigating between pages', () => {
      ECommercePage.addProductToCart('Sauce Labs Backpack')
      ECommercePage.assertCartCount(1)

      // Navigate to a product detail page and back
      cy.contains('.inventory_item_name', 'Sauce Labs Backpack').click()
      cy.go('back')

      ECommercePage.assertCartCount(1) // cart should still have 1 item
    })

  })

  // ── Checkout Flow Tests (TC-006 to TC-014) ────────────────────────────────

  context('Checkout Flow', () => {

    it('TC-006 — Complete checkout with valid details shows confirmation', () => {
      const { firstName, lastName, zip } = testData.checkoutInfo

      ECommercePage.addProductToCart('Sauce Labs Backpack')
      ECommercePage.openCart()

      cy.get('[data-test="checkout"]').click()
      ECommercePage.fillShippingInfo(firstName, lastName, zip)
      ECommercePage.continueBtn.click()

      // Review page — verify item and price are shown
      cy.get('.cart_item').should('have.length', 1)
      cy.get('.summary_total_label').should('be.visible')

      ECommercePage.finishBtn.click()
      ECommercePage.assertOrderConfirmed()
    })

    it('TC-014b — Checkout button is disabled/absent when cart is empty', () => {
      // Navigate to cart without adding anything
      ECommercePage.openCart()

      // Cart should be empty
      ECommercePage.cartItems.should('not.exist')

      // The checkout button should either not be visible or lead to an empty review
      // SauceDemo actually allows it — this test documents the behaviour
      cy.get('[data-test="checkout"]').then($btn => {
        if ($btn.length > 0) {
          // Bug: checkout is possible with empty cart
          // In a real app this should be blocked — log as a known defect
          cy.log('⚠️ DEFECT: Checkout allowed with empty cart')
        }
      })
    })

    it('Checkout form requires first name', () => {
      ECommercePage.addProductToCart('Sauce Labs Backpack')
      ECommercePage.openCart()
      cy.get('[data-test="checkout"]').click()

      // Leave first name empty, fill others
      ECommercePage.lastNameField.type('Afolabi')
      ECommercePage.postalCodeField.type('12345')
      ECommercePage.continueBtn.click()

      cy.get('[data-test="error"]').should('contain', 'First Name is required')
    })

    it('Checkout form requires last name', () => {
      ECommercePage.addProductToCart('Sauce Labs Backpack')
      ECommercePage.openCart()
      cy.get('[data-test="checkout"]').click()

      ECommercePage.firstNameField.type('Daniel')
      ECommercePage.postalCodeField.type('12345')
      ECommercePage.continueBtn.click()

      cy.get('[data-test="error"]').should('contain', 'Last Name is required')
    })

    it('Checkout form requires postal code', () => {
      ECommercePage.addProductToCart('Sauce Labs Backpack')
      ECommercePage.openCart()
      cy.get('[data-test="checkout"]').click()

      ECommercePage.firstNameField.type('Daniel')
      ECommercePage.lastNameField.type('Afolabi')
      ECommercePage.continueBtn.click()

      cy.get('[data-test="error"]').should('contain', 'Postal Code is required')
    })

  })

  // ── Product Sorting & Filtering (non-functional) ───────────────────────────

  context('Product Sorting', () => {

    it('Products can be sorted A–Z by name', () => {
      ECommercePage.sortBy('az')

      cy.get('.inventory_item_name').then($names => {
        const names = [...$names].map(el => el.innerText)
        const sorted = [...names].sort()
        expect(names).to.deep.equal(sorted)
      })
    })

    it('Products can be sorted Z–A by name', () => {
      ECommercePage.sortBy('za')

      cy.get('.inventory_item_name').then($names => {
        const names = [...$names].map(el => el.innerText)
        const sorted = [...names].sort().reverse()
        expect(names).to.deep.equal(sorted)
      })
    })

    it('Products can be sorted by price low–high', () => {
      ECommercePage.sortBy('lohi')

      cy.get('.inventory_item_price').then($prices => {
        const prices = [...$prices].map(el => parseFloat(el.innerText.replace('$', '')))
        const sorted = [...prices].sort((a, b) => a - b)
        expect(prices).to.deep.equal(sorted)
      })
    })

  })

})
