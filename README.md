# RedSys CMS Automation Tests

Cypress E2E tests for RedSys CMS automation.

## Test Structure

**Stage 1**: Basic tests (author, brand, issue-article, full-flow)
**Stage 2**: Conference brand test (creates brand with series for all genres and publishes)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure `cypress.env.json` with your credentials (use `cypress.env.json.example` as template)

## Running Tests

- **Open Cypress Test Runner:**
  ```bash
  npm run open
  ```

- **Run all tests:**
  ```bash
  npm test
  ```

- **Run in headed mode:**
  ```bash
  npm run test:headed
  ```

## Project Structure

```
cypress/
├── e2e/
│   ├── stage-1/          # Basic tests
│   └── stage-2/          # Conference brand test
├── fixtures/
│   └── images/          # Test images
└── support/
    ├── commands/         # Custom commands (auth, upload)
    └── helpers/          # Helper functions
```

## Custom Commands

- `cy.loginAs(userType)` - Login as specified user (default: 'admin')
- `cy.uploadByTestId(testId, filePath)` - Upload file by test ID
