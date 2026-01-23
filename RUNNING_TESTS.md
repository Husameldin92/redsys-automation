# Running Tests Guide

## Quick Reference

### Run Individual Test Files

```bash
# Run only Brand tests
npm run test:brand

# Run only Issue tests
npm run test:issue

# Run only Author tests
npm run test:author

# Run only Article tests
npm run test:article
```

### Run All Tests Together

```bash
# Run all entity tests (brand, issue, author, article)
npm run test:all

# Or run everything in cypress/e2e folder
npm test
```

## Detailed Options

### Using Cypress CLI Directly

You can also use Cypress commands directly:

```bash
# Run specific file
npx cypress run --spec "cypress/e2e/brand.cy.js"

# Run multiple specific files
npx cypress run --spec "cypress/e2e/brand.cy.js,cypress/e2e/author.cy.js"

# Run all files matching a pattern
npx cypress run --spec "cypress/e2e/*.cy.js"

# Run all files except legacy combined test
npx cypress run --spec "cypress/e2e/{brand,issue,author,article}.cy.js"
```

### Interactive Mode (Cypress Test Runner)

Open Cypress Test Runner to select and run tests interactively:

```bash
npm run open
# or
npx cypress open
```

In the Test Runner:
- Click on any test file to run it individually
- Use the search bar to filter tests
- Run all tests by selecting the folder

### Headed Mode (See Browser)

Run tests with visible browser:

```bash
# Run all tests with visible browser
npm run test:headed

# Run specific test with visible browser
npx cypress run --headed --spec "cypress/e2e/brand.cy.js"
```

### Run in Specific Browser

```bash
# Run in Chrome
npm run test:chrome

# Run specific test in Chrome
npx cypress run --browser chrome --spec "cypress/e2e/brand.cy.js"
```

## Test File Structure

```
cypress/e2e/
├── brand.cy.js          → npm run test:brand
├── issue.cy.js           → npm run test:issue
├── author.cy.js          → npm run test:author
├── article.cy.js         → npm run test:article
└── brand-issue-author-article.cy.js  (legacy - can be removed)
```

## Examples

### Example 1: Run Only Brand Tests
```bash
npm run test:brand
```

### Example 2: Run Brand and Author Tests Together
```bash
npx cypress run --spec "cypress/e2e/brand.cy.js,cypress/e2e/author.cy.js"
```

### Example 3: Run All Entity Tests (Excluding Legacy)
```bash
npm run test:all
```

### Example 4: Run All Tests Including Debug Tests
```bash
npm test
```

## Tips

1. **Quick Development**: Use `npm run open` to interactively run tests while developing
2. **CI/CD**: Use `npm run test:all` to run all entity tests in CI pipelines
3. **Debugging**: Use `npm run test:headed` to see what's happening in the browser
4. **Specific Feature**: Use individual test commands (`test:brand`, etc.) for focused testing

## Notes

- Each test file is independent and can be run separately
- Tests share the same `before()` hook for login (runs once per file)
- The legacy `brand-issue-author-article.cy.js` file can be removed once migration is complete
