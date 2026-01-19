describe('Brand, Issue, Author, and Article Creation Flow', () => {
  // Generate unique identifiers for test data
  const timestamp = Date.now();
  const brandName = `E2E Brand ${timestamp}`;
  const issueName = `E2E Issue ${timestamp}`;
  const authorName = `E2E Author ${timestamp}`;
  const articleTitle = `E2E Article ${timestamp}`;
  
  before(() => {
    // Login once before all tests
    cy.loginAs('admin');
  });
  
  it('should create a complete content hierarchy: Brand → Issue → Author → Article', () => {
    // Step 1: Create Brand
    cy.log('Creating Brand');
    cy.visit('/brands/new');
    
    // Fill brand details
    cy.get('[data-testid="brand-name-input"]').type(brandName);
    
    // Upload brand image
    cy.uploadByTestId('brand-image-upload', 'cypress/fixtures/images/brand.jpg');
    
    // Save brand
    cy.get('[data-testid="brand-save-btn"]').click();
    
    // Assert brand creation success
    cy.get('[data-testid="toast-success"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Brand created successfully');
    
    cy.get('[data-testid="brand-detail-title"]')
      .should('be.visible')
      .and('contain', brandName);
    
    // Step 2: Create Issue under the Brand
    cy.log('Creating Issue');
    
    // Click create issue button (assuming it's on the brand detail page)
    cy.get('[data-testid="issue-create-btn"]').click();
    
    // Alternative: Navigate directly to issues/new and select brand
    // cy.visit('/issues/new');
    // cy.get('[data-testid="issue-brand-select"]').click();
    // cy.get(`[data-testid="brand-option-${brandName}"]`).click();
    
    // Fill issue details
    cy.get('[data-testid="issue-name-input"]').type(issueName);
    
    // Upload issue image
    cy.uploadByTestId('issue-image-upload', 'cypress/fixtures/images/issue.jpg');
    
    // Save issue
    cy.get('[data-testid="issue-save-btn"]').click();
    
    // Assert issue creation success
    cy.get('[data-testid="toast-success"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Issue created successfully');
    
    // Verify issue appears in list or card
    cy.get('[data-testid="issue-card"]')
      .should('be.visible')
      .and('contain', issueName);
    
    // Step 3: Create Author
    cy.log('Creating Author');
    cy.visit('/authors/new');
    
    // Fill author details
    cy.get('[data-testid="author-name-input"]').type(authorName);
    
    // Upload author image
    cy.uploadByTestId('author-image-upload', 'cypress/fixtures/images/author.jpg');
    
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
    
    // Step 4: Create Article and link everything
    cy.log('Creating Article with associations');
    cy.visit('/articles/new');
    
    // Fill article title
    cy.get('[data-testid="article-title-input"]').type(articleTitle);
    
    // Upload article image
    cy.uploadByTestId('article-image-upload', 'cypress/fixtures/images/article.jpg');
    
    // Select author
    cy.get('[data-testid="article-author-select"]').click();
    cy.get('[data-testid="author-option"]')
      .contains(authorName)
      .click();
    
    // Select issue (which should be linked to the brand)
    cy.get('[data-testid="article-issue-select"]').click();
    cy.get('[data-testid="issue-option"]')
      .contains(issueName)
      .click();
    
    // Save article
    cy.get('[data-testid="article-save-btn"]').click();
    
    // Assert article creation success
    cy.get('[data-testid="toast-success"]', { timeout: 10000 })
      .should('be.visible')
      .and('contain', 'Article created successfully');
    
    // Verify article status and associations
    cy.get('[data-testid="article-status-chip"]')
      .should('be.visible')
      .and('contain', 'Draft');
    
    // Verify linked author
    cy.get('[data-testid="article-author-link"]')
      .should('be.visible')
      .and('contain', authorName);
    
    // Verify linked issue
    cy.get('[data-testid="article-issue-link"]')
      .should('be.visible')
      .and('contain', issueName);
    
    // Optional: Verify brand association through issue
    cy.get('[data-testid="article-brand-link"]')
      .should('be.visible')
      .and('contain', brandName);
  });
  
  // Additional test to verify the created entities persist
  it('should verify all created entities are accessible', () => {
    // Verify Brand
    cy.visit('/brands');
    cy.get('[data-testid="brand-list-item"]')
      .contains(brandName)
      .should('exist');
    
    // Verify Issue
    cy.visit('/issues');
    cy.get('[data-testid="issue-list-item"]')
      .contains(issueName)
      .should('exist');
    
    // Verify Author
    cy.visit('/authors');
    cy.get('[data-testid="author-list-item"]')
      .contains(authorName)
      .should('exist');
    
    // Verify Article
    cy.visit('/articles');
    cy.get('[data-testid="article-list-item"]')
      .contains(articleTitle)
      .should('exist');
  });
});
