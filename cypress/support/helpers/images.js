// Image paths for different upload types
const IMAGE_PATHS = {
  // Brand images
  brandLogo: 'cypress/fixtures/images/brand-logo.png',
  brandTransparentLogo: 'cypress/fixtures/images/brand-transparent-logo.svg',
  brandHeader: 'cypress/fixtures/images/brand-header.png',
  brandIssueBackground: 'cypress/fixtures/images/brand-issue-background.png',
  brandArticleOverlay: 'cypress/fixtures/images/brand-article-overlay.png',
  brandGenericTeaser: 'cypress/fixtures/images/brand-generic-teaser.jpg', // 2048 x 848
  
  // Issue images
  issueCover: 'cypress/fixtures/images/issue-cover.jpg',
  issueThumbnail: 'cypress/fixtures/images/issue-thumbnail.jpg',
  
  // Author images
  authorPhoto: 'cypress/fixtures/images/author-photo.jpg',
  authorAvatar: 'cypress/fixtures/images/author-avatar.jpg',
  
  // Article images
  articleImage: 'cypress/fixtures/images/article-image.jpg',
  articleThumbnail: 'cypress/fixtures/images/article-thumbnail.jpg',
  articleHero: 'cypress/fixtures/images/article-hero.jpg',
  
  // Generic fallbacks
  default: 'cypress/fixtures/images/default.jpg',
};

/**
 * Upload an image by type name
 * @param {string} testId - data-testid of the upload input
 * @param {string} imageType - Type of image (e.g., 'brandLogo', 'authorPhoto')
 */
Cypress.Commands.add('uploadImageByType', (testId, imageType) => {
  const imagePath = IMAGE_PATHS[imageType] || IMAGE_PATHS.default;
  
  cy.get(`[data-testid="${testId}"]`).selectFile(imagePath, { force: true });
  cy.wait(500); // Wait for upload to process
});

/**
 * Upload an image by custom path
 * @param {string} testId - data-testid of the upload input
 * @param {string} imagePath - Custom path to image file
 */
Cypress.Commands.add('uploadImage', (testId, imagePath) => {
  cy.get(`[data-testid="${testId}"]`).selectFile(imagePath, { force: true });
  cy.wait(500);
});

/**
 * Upload an image to a dropzone by finding the file input within it
 * @param {string} dropzoneSelector - Selector for the dropzone container
 * @param {string} imagePath - Path to image file
 */
Cypress.Commands.add('uploadToDropzone', (dropzoneSelector, imagePath) => {
  // Try to find file input within the dropzone
  cy.get(dropzoneSelector).within(() => {
    cy.get('input[type="file"]').selectFile(imagePath, { force: true });
  });
  cy.wait(500);
});

// Export for use in tests
Cypress.IMAGE_PATHS = IMAGE_PATHS;
