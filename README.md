# 🤖 QA Automation — Cypress Test Suites

**Author:** Daniel Afolabi | QA Engineer
**Stack:** Cypress 13 · JavaScript · Page Object Model · GitHub Actions CI/CD

![Cypress Tests](https://github.com/YOUR-USERNAME/qa-automation/actions/workflows/cypress.yml/badge.svg)

---

## Overview

This project contains three automated test suites built with Cypress, covering real publicly accessible applications. It demonstrates:

- **Page Object Model (POM)** — selectors and actions separated from test logic
- **Custom Commands** — reusable helpers registered in `cypress/support/commands.js`
- **Data-driven testing** — test data loaded from `cypress/fixtures/testData.json`
- **CI/CD integration** — GitHub Actions runs all suites in parallel on every push
- **Security testing** — XSS and SQL injection test cases included

---

## Project Structure

```
cypress-portfolio/
├── .github/
│   └── workflows/
│       └── cypress.yml          # GitHub Actions CI pipeline
├── cypress/
│   ├── e2e/
│   │   ├── login/
│   │   │   └── orangehrm-login.cy.js     # Suite 1 — Login testing
│   │   ├── demoqa/
│   │   │   └── demoqa-form.cy.js         # Suite 2 — Form validation & XSS
│   │   └── ecommerce/
│   │       └── saucedemo-checkout.cy.js  # Suite 3 — Checkout & cart
│   ├── support/
│   │   ├── commands.js                   # Custom Cypress commands
│   │   └── pages/
│   │       ├── LoginPage.js              # POM — OrangeHRM login
│   │       ├── DemoQAFormPage.js         # POM — DemoQA practice form
│   │       └── ECommercePage.js          # POM — SauceDemo e-commerce
│   └── fixtures/
│       └── testData.json                 # Centralised test data
├── cypress.config.js
└── package.json
```

---

## Test Suites

### Suite 1 — OrangeHRM Login (`cypress/e2e/login/`)
**App:** https://opensource-demo.orangehrmlive.com

| Test | Type | Status |
|------|------|--------|
| Valid credentials redirect to dashboard | Functional | ✅ |
| Invalid password shows error | Functional | ✅ |
| Empty fields show required validation | Functional | ✅ |
| SQL injection in username rejected | Security | ✅ |
| SQL injection in password rejected | Security | ✅ |
| Login completes within 5 seconds | Performance | ✅ |
| Password field masks input | UI | ✅ |

### Suite 2 — DemoQA Form (`cypress/e2e/demoqa/`)
**App:** https://demoqa.com/automation-practice-form

| Test | Type | Status |
|------|------|--------|
| Valid form submits successfully | Functional | ✅ |
| Empty required fields blocked on submit | Validation | ✅ |
| Invalid email format rejected | Validation | ✅ |
| Non-numeric mobile number rejected | Validation | ✅ |
| 1000-character input does not crash form | Edge Case | ✅ |
| XSS script injection does not execute | Security | ✅ |
| HTML injection not rendered as HTML | Security | ✅ |
| Rapid submit clicks produce one modal only | Reliability | ✅ |

### Suite 3 — SauceDemo Checkout (`cypress/e2e/ecommerce/`)
**App:** https://www.saucedemo.com

| Test | Type | Status |
|------|------|--------|
| Valid login redirects to inventory | Functional | ✅ |
| Locked user sees error message | Functional | ✅ |
| Add single item updates cart badge | Cart | ✅ |
| Add multiple items shows correct count | Cart | ✅ |
| Remove item updates cart count | Cart | ✅ |
| Cart persists across page navigation | Cart | ✅ |
| Full checkout flow shows confirmation | Checkout | ✅ |
| Checkout requires first name | Validation | ✅ |
| Checkout requires last name | Validation | ✅ |
| Checkout requires postal code | Validation | ✅ |
| Products sort A–Z correctly | Sorting | ✅ |
| Products sort by price low–high | Sorting | ✅ |

---

## Getting Started

### Prerequisites
- Node.js v18 or higher
- npm v9 or higher

### Install

```bash
git clone https://github.com/YOUR-USERNAME/qa-automation.git
cd qa-automation
npm install
```

### Run Tests

```bash
# Open Cypress interactive runner
npm run cy:open

# Run all suites headlessly (CI mode)
npm run cy:run

# Run individual suites
npm run cy:run:login
npm run cy:run:demoqa
npm run cy:run:ecommerce
```

---

## CI/CD — GitHub Actions

Every push to `main` or `develop` triggers the full test suite automatically. All three suites run **in parallel** to keep feedback fast.

**Pipeline steps:**
1. Checkout code
2. Install Node.js 20 + dependencies
3. Run Cypress suites in parallel (login / demoqa / ecommerce)
4. Upload screenshots on failure
5. Upload videos and reports as artefacts

**To set up CI secrets in your GitHub repo:**

Go to **Settings → Secrets and Variables → Actions** and add:

| Secret Name | Value |
|-------------|-------|
| `ORANGEHRM_USER` | `Admin` |
| `ORANGEHRM_PASS` | `admin123` |
| `ECOMMERCE_USER` | `standard_user` |
| `ECOMMERCE_PASS` | `secret_sauce` |

---

## Design Decisions

### Page Object Model
All element selectors live in `cypress/support/pages/`. Tests never contain raw CSS selectors — if a selector changes, you update it in one place only.

### Custom Commands
Reusable multi-step actions (login, addToCart, completeCheckout) are registered as Cypress commands so tests stay readable and concise.

### Fixtures
All test data (credentials, product names, payloads) lives in `testData.json`. Tests reference the fixture — not hardcoded values — making data changes trivial.

### Security Tests
XSS and SQL injection tests are included because they were real findings from the exploratory testing sessions documented in the QA portfolio.

---

## Links

- 📋 [Full QA Portfolio](https://github.com/YOUR-USERNAME/qa-portfolio)
- 🐛 [Bug Reports](https://github.com/YOUR-USERNAME/qa-portfolio/tree/main/project-1-login-testing/bug-reports)
- 📄 [Resume](https://github.com/YOUR-USERNAME/qa-portfolio/blob/main/docs/resume.md)
