# Test Structure Documentation

## Overview

The test suite supports **two execution flows**:

1. **Individual Tests**: Each entity can be run separately for focused testing
2. **Full Sequential Flow**: Run brand → author → issue/article in one continuous test

## File Structure

```
cypress/
├── e2e/
│   ├── brand.cy.js              # Brand creation and management tests (individual)
│   ├── author.cy.js            # Author creation and publishing tests (individual)
│   ├── issue-article.cy.js     # Issue and article creation/editing tests (individual)
│   └── full-flow.cy.js         # Sequential flow: brand → author → issue/article
│
├── support/
│   ├── commands/
│   │   ├── auth.js             # Authentication commands
│   │   └── upload.js           # Basic upload command
│   │
│   ├── helpers/
│   │   ├── dropdowns.js        # Dropdown interaction helpers
│   │   ├── images.js           # Image upload helpers with named types
│   │   └── test-data.js        # Cross-test data sharing helpers
│   │
│   └── e2e.js                   # Global test configuration
│
└── fixtures/
    ├── images/
    │   ├── README.md            # Image requirements documentation
    │   └── [image files]        # Test images (see README.md for list)
    ├── last-created-brand.json  # Shared data: last created brand name
    └── last-created-author.json # Shared data: last created author name
```

## Test Execution Flows

### Flow 1: Individual Tests (Default)

Run each test file independently:

```bash
# Run individual tests
npm run test:brand          # Brand creation and editing
npm run test:author         # Author creation and publishing
npm run test:issue-article  # Issue and article creation/editing

# Or run all individual tests
npm run test:all
```

**Characteristics:**
- Each test file logs in independently
- Tests can be run in any order
- Data sharing via JSON fixtures (`last-created-brand.json`, `last-created-author.json`)
- Useful for debugging specific entities

### Flow 2: Full Sequential Flow

Run the complete workflow in one test:

```bash
npm run test:full-flow
```

**Characteristics:**
- Single login session for all steps
- Runs in strict order: Brand → Author → Issue/Article
- All entities are connected (brand linked to issue, author linked to article)
- Faster execution (no repeated logins)
- Useful for end-to-end validation

**What it does:**
1. **Step 1**: Creates brand, edits it, uploads all brand images
2. **Step 2**: Creates author, uploads avatar, publishes author
3. **Step 3**: Creates issue (connected to brand), creates article (connected to issue), edits article (connects author, uploads images), publishes everything

## Helper Functions

### Dropdown Helpers (`cypress/support/helpers/dropdowns.js`)

#### `cy.selectReactSelectOption(controlSelector, optionText, reactSelectNumber)`
Selects an option from a React Select dropdown by ID pattern.

**Parameters:**
- `controlSelector` (string): CSS selector for the dropdown control
- `optionText` (string|array): Text to search for (can be array to try multiple options)
- `reactSelectNumber` (number, optional): Specific react-select number (e.g., 2 for react-select-2)

**Example:**
```javascript
// Select by specific react-select number
cy.selectReactSelectOption('.drop-down .css-bg1rzq-control', ['entwickler.de', 'devmio'], 2);

// Select any option (auto-detect react-select number)
cy.selectReactSelectOption('.input-conferenceSeriesId .css-bg1rzq-control', null);
```

#### `cy.selectReactSelectOptionByRole(controlSelector, optionText)`
Selects an option using `role="option"` attribute (more reliable for some dropdowns).

**Parameters:**
- `controlSelector` (string): CSS selector for the dropdown control
- `optionText` (string|array): Text to search for

**Example:**
```javascript
cy.selectReactSelectOptionByRole('.input-language .css-bg1rzq-control', ['English', 'German']);
```

### Image Upload Helpers (`cypress/support/helpers/images.js`)

#### `cy.uploadImageByType(testId, imageType)`
Uploads an image using a named image type.

**Parameters:**
- `testId` (string): data-testid of the upload input
- `imageType` (string): Type of image (e.g., 'brandLogo', 'authorPhoto')

**Available Image Types:**
- Brand: `brandLogo`, `brandTransparentLogo`, `brandHeader`, `brandIssueBackground`, `brandArticleOverlay`, `brandGenericTeaser`
- Issue: `issueCover`, `issueThumbnail`
- Author: `authorPhoto`, `authorAvatar`
- Article: `articleImage`, `articleThumbnail`, `articleHero`
- `default` (fallback)

**Example:**
```javascript
cy.uploadImageByType('brand-logo-upload', 'brandLogo');
cy.uploadImageByType('author-image-upload', 'authorPhoto');
```

#### `cy.uploadImage(testId, imagePath)`
Uploads an image using a custom file path.

**Parameters:**
- `testId` (string): data-testid of the upload input
- `imagePath` (string): Path to the image file

**Example:**
```javascript
cy.uploadImage('custom-upload', 'cypress/fixtures/images/custom.jpg');
```

## Test Files

### `brand.cy.js`
Tests for brand creation and management:
- Creates a new brand with all required fields
- Edits brand and uploads images:
  - Logo
  - Transparent Logo
  - Header
  - Issue background images
  - Article Overlay Image
  - Generic Teaser Image (2048 x 848)
- Stores brand name for use in issue tests (`cy.storeLastCreatedBrand()`)

### `author.cy.js`
Tests for author creation and publishing:
- Creates author with name, slug, forname, surname, company, and bios
- Edits author to upload avatar image
- Publishes the author
- Stores author name for use in article tests (`cy.storeLastCreatedAuthor()`)

### `issue-article.cy.js`
Tests for issue and article creation/editing:
- **Issue Creation**: Creates issue connected to last created brand
  - Fills designation, slug, cover story, in-app purchase ID
  - Selects publication date from calendar widget
  - Edits issue to upload cover image
- **Article Creation**: Creates article within the issue
  - Selects article type (standard)
  - Fills headline, subtitle, slug
  - Selects primary category and topics
- **Article Editing**: Edits article to connect author and upload images
  - Connects to last created author
  - Uploads teaser image and HTML file
- **Publishing**: Publishes the issue (which publishes brand, issue, and article)

### `full-flow.cy.js`
Combines all three tests into a single sequential flow:
- **Step 1**: Brand creation and editing (same as `brand.cy.js`)
- **Step 2**: Author creation and publishing (same as `author.cy.js`)
- **Step 3**: Issue/article creation, editing, and publishing (same as `issue-article.cy.js`)
- All steps run in one test session with a single login

## Image Setup

1. Create images in `cypress/fixtures/images/` with the exact names listed in `cypress/fixtures/images/README.md`
2. Images should be valid JPG files
3. Recommended size: 800x600px or larger
4. Keep file sizes under 2MB

## Data Sharing Between Tests

Tests share data using JSON fixture files:

### `cypress/fixtures/last-created-brand.json`
Stores the brand name created in `brand.cy.js` for use in `issue-article.cy.js`.

**Commands:**
- `cy.storeLastCreatedBrand(brandName)` - Store brand name after creation
- `cy.getLastCreatedBrand()` - Retrieve brand name in issue/article tests

### `cypress/fixtures/last-created-author.json`
Stores the author name created in `author.cy.js` for use in `issue-article.cy.js`.

**Commands:**
- `cy.storeLastCreatedAuthor(authorName)` - Store author name after creation
- `cy.getLastCreatedAuthor()` - Retrieve author name in article edit tests

**Note**: These files are gitignored (see `.gitignore`) as they contain dynamic test data.

## Helper Functions

### Test Data Helpers (`cypress/support/helpers/test-data.js`)

#### `cy.storeLastCreatedBrand(brandName)`
Stores the brand name for cross-test communication.

#### `cy.getLastCreatedBrand()`
Retrieves the last created brand name.

#### `cy.storeLastCreatedAuthor(authorName)`
Stores the author name for cross-test communication.

#### `cy.getLastCreatedAuthor()`
Retrieves the last created author name.
