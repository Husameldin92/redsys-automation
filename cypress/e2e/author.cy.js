describe('Author Creation', () => {
  // Generate unique identifier for test data
  const timestamp = Date.now();
  const authorName = `E2E Author ${timestamp}`;
  
  before(() => {
    // Login once before all tests
    cy.loginAs('admin');
  });
  
  it('should create a new author with image', () => {
    cy.log('Creating Author');
    cy.visit('/authors');
    cy.contains('Not Allowed').should('not.exist');
    
    // TODO: Add author creation button click here
    // cy.get('[data-testid="create-author-btn"]').click();
    
    // Fill author details
    cy.get('[data-testid="author-name-input"]').type(authorName);
    
    // Upload author image using named image type
    cy.uploadImageByType('author-image-upload', 'authorPhoto');
    
    // Save author
    cy.get('[data-testid="author-save-btn"]').click();
    
    // Assert author creation success
    cy.get('[data-testid="toast-success"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Author created successfully');
    
    // Verify author card shows name
    cy.get('[data-testid="author-card"]')
      .should('be.visible')
      .and('contain', authorName);
  });
  
  it('should verify author exists in list', () => {
    cy.visit('/authors');
    cy.wait(2000);
    cy.contains(authorName, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
  });
});
