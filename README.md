# RedSys CMS Automation Tests

This Cypress project automates the complete CMS content creation flow through the UI.

## Test Flow

The test creates the following entities in sequence:
1. **Brand** (with image upload)
2. **Issue** (under the Brand, with image)
3. **Author** (with image)
4. **Article** (with image, linked to Author and Issue/Brand)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Add test images:
   Place the following images in `cypress/fixtures/images/`:
   - `brand.jpg` - Image for brand creation
   - `issue.jpg` - Image for issue creation
   - `author.jpg` - Image for author creation
   - `article.jpg` - Image for article creation

3. Configure environment variables:
   The `cypress.env.json` file has been created with your credentials.
   Update it if needed.

4. The base URL in `cypress.config.js` has been set to: `https://redsys-stage.sandsmedia.com/`

## Running Tests

- **Open Cypress Test Runner:**
  ```bash
  npm run open
  ```

- **Run tests in headless mode:**
  ```bash
  npm test
  ```

- **Run tests in headed mode:**
  ```bash
  npm run test:headed
  ```

- **Run tests in Chrome:**
  ```bash
  npm run test:chrome
  ```

## Project Structure

```
cypress/
├── e2e/
│   └── brand-issue-author-article.cy.js  # Main test file
├── fixtures/
│   └── images/                           # Test images
│       ├── brand.jpg
│       ├── issue.jpg
│       ├── author.jpg
│       └── article.jpg
├── support/
│   ├── e2e.js                           # Global config & error handler
│   └── commands/
│       ├── auth.js                      # Login command
│       └── upload.js                    # File upload command
├── videos/                              # Test recordings (auto-generated)
└── screenshots/                         # Test screenshots (auto-generated)
```

## Key Features

- **JavaScript only** - No TypeScript files
- **UI-based validation** - No GraphQL intercepts
- **Stable selectors** - Uses data-testid attributes
- **Console error detection** - Tests fail on any console.error
- **Image uploads** - Automated file uploads from fixtures
- **Retry configuration** - 2 retries in CI, 0 in interactive mode

## Custom Commands

### `cy.loginAs(userType)`
Logs in as the specified user type (default: 'admin')

### `cy.uploadByTestId(testId, filePath)`
Uploads a file to an input element identified by data-testid

## Troubleshooting

1. **Login fails**: Update the login selectors in `cypress/support/commands/auth.js` to match your app's login form.

2. **Selectors not found**: The test assumes specific data-testid attributes. Update the selectors in the test file to match your application.

3. **Upload issues**: Ensure the file input elements accept the `selectFile` command. You may need to adjust the upload command.

4. **Timeout errors**: Increase timeout values in `cypress.config.js` if your application is slow.

## Environment Variables

The following environment variables can be set in `cypress.env.json`:
- `ADMIN_USERNAME`: Admin username for login
- `ADMIN_PASSWORD`: Admin password for login
- `AUTH_TOKEN`: (Optional) Direct auth token if using token-based auth
