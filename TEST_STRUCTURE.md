# Test Structure Documentation

## Overview

The test suite has been reorganized into separate test files for better maintainability and clarity. Each entity (Brand, Issue, Author, Article) now has its own dedicated test file.

## File Structure

```
cypress/
├── e2e/
│   ├── brand.cy.js          # Brand creation and management tests
│   ├── issue.cy.js           # Issue creation tests
│   ├── author.cy.js          # Author creation tests
│   ├── article.cy.js         # Article creation tests
│   └── brand-issue-author-article.cy.js  # Legacy combined test (can be removed)
│
├── support/
│   ├── commands/
│   │   ├── auth.js           # Authentication commands
│   │   └── upload.js          # Basic upload command
│   │
│   ├── helpers/
│   │   ├── dropdowns.js      # Dropdown interaction helpers
│   │   └── images.js          # Image upload helpers with named types
│   │
│   └── e2e.js                 # Global test configuration
│
└── fixtures/
    └── images/
        ├── README.md          # Image requirements documentation
        └── [image files]      # Test images (see README.md for list)
```

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
  - LOGO
  - Transparent Logo
  - Header
  - Issue background images
  - Article Overlay Image
  - Generic Teaser Image (2048 x 848)
- Verifies brand exists in list

### `issue.cy.js`
Tests for issue creation (structure ready, needs implementation)

### `author.cy.js`
Tests for author creation:
- Creates author with name and photo
- Verifies author creation

### `article.cy.js`
Tests for article creation:
- Creates article with title and image
- Can associate with author and issue
- Verifies article creation

## Image Setup

1. Create images in `cypress/fixtures/images/` with the exact names listed in `cypress/fixtures/images/README.md`
2. Images should be valid JPG files
3. Recommended size: 800x600px or larger
4. Keep file sizes under 2MB

## Migration Notes

- The original `brand-issue-author-article.cy.js` file is kept for reference but can be removed once all tests are migrated
- Each test file is independent and can be run separately
- Shared helpers are imported automatically via `cypress/support/e2e.js`

## Next Steps

1. **Complete Issue Tests**: Implement issue creation form interactions in `issue.cy.js`
2. **Add Brand Edit Tests**: Complete the brand editing flow with all image uploads
3. **Create Test Images**: Generate all required test images (see `cypress/fixtures/images/README.md`)
4. **Update Selectors**: Replace any hardcoded selectors with data-testid attributes where possible
5. **Add More Tests**: Expand test coverage for each entity
