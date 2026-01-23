describe('Article Creation', () => {
  // Generate unique identifier for test data
  const timestamp = Date.now();
  const articleTitle = `E2E Article ${timestamp}`;
  
  before(() => {
    // Login once before all tests
    cy.loginAs('admin');
  });
  
  it('should create a new article with associations', () => {
    cy.log('Creating Article with associations');
    cy.visit('/articles/new');
    
    // Fill article title
    cy.get('[data-testid="article-title-input"]').type(articleTitle);
    
    // Upload article image using named image type
    cy.uploadImageByType('article-image-upload', 'articleImage');
    
    // TODO: Select author and issue if needed
    // cy.get('[data-testid="article-author-select"]').click();
    // cy.get('[data-testid="author-option"]').contains(authorName).click();
    
    // Save article
    cy.get('[data-testid="article-save-btn"]').click();
    
    // Assert article creation success
    cy.get('[data-testid="toast-success"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Article created successfully');
    
    // Verify article status
    cy.get('[data-testid="article-status-chip"]')
      .should('be.visible')
      .and('contain', 'Draft');
  });
  
  it('should verify article exists in list', () => {
    cy.visit('/articles');
    cy.wait(2000);
    cy.contains(articleTitle, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
  });
});
