# Test Images

This directory contains images used for testing file uploads in Cypress tests.

## Required Images

Create the following images with these exact names:

### Brand Images
- `brand-logo.jpg` - Logo image for brands
- `brand-transparent-logo.png` - Transparent logo image for brands (PNG format)
- `brand-header.jpg` - Header image for brands
- `brand-issue-background.jpg` - Issue background image for brands
- `brand-article-overlay.jpg` - Article overlay image for brands
- `brand-generic-teaser.jpg` - Generic teaser image for brands (2048 x 848 pixels, JPG or PNG)

### Issue Images
- `issue-cover.jpg` - Cover image for issues
- `issue-thumbnail.jpg` - Thumbnail image for issues

### Author Images
- `author-photo.jpg` - Photo image for authors
- `author-avatar.jpg` - Avatar image for authors

### Article Images
- `article-image.jpg` - Main image for articles
- `article-thumbnail.jpg` - Thumbnail image for articles
- `article-hero.jpg` - Hero image for articles

### Generic
- `default.jpg` - Default fallback image

## Image Specifications

- **Format**: JPG/JPEG (PNG for transparent logo)
- **Size**: 
  - General images: Recommended 800x600px or larger
  - Generic Teaser: Must be 2048 x 848 pixels (JPG or PNG)
- **File Size**: Keep under 2MB for faster test execution

## Usage in Tests

Images are referenced by type name in tests:

```javascript
// Upload brand logo
cy.uploadImageByType('brand-logo-upload', 'brandLogo');

// Upload custom image
cy.uploadImage('custom-upload-input', 'cypress/fixtures/images/custom.jpg');
```

## Generating Test Images

You can create simple test images using any image editor, or use placeholder services. For automated generation, you can use tools like:

- ImageMagick: `convert -size 800x600 xc:blue brand-logo.jpg`
- Online placeholder services
- Any image editing software

## Notes

- All images should be valid image files
- Images are not committed to git (see .gitignore)
- Each test run uses the same images, so ensure they're available before running tests
