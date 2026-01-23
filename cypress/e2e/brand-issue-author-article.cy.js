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
    cy.visit('/brands');
    cy.contains('Not Allowed').should('not.exist');
    cy.get('a[href="#"]')
  .contains('Create new Magazine')
  .should('be.visible')
  .click();
    cy.get('#frc-name--1782415253').type(brandName);
    cy.get('#frc-slug--1317495733').type(brandName.toLowerCase().replace(/ /g, '-'));
    cy.get('#frc-price-1858698673').type('100');
    cy.get('#frc-size--483674448').type('100');
    // Click the control to open the dropdown
    cy.get('.drop-down .css-bg1rzq-control').click();
    
    // Wait for menu to render and find options by ID pattern
    cy.wait(500);
    
    // Find the option by ID pattern - react-select-2-option-X
    // Check each option until we find entwickler.de or devmio
    cy.get('[id^="react-select-2-option-"]', { timeout: 10000 })
      .should('have.length.at.least', 1)
      .then(($options) => {
        // Find entwickler.de option
        const entwicklerOption = Array.from($options).find(opt => 
          opt.textContent.includes('entwickler.de')
        );
        
        if (entwicklerOption) {
          cy.wrap(entwicklerOption).click();
        } else {
          // Find devmio option
          const devmioOption = Array.from($options).find(opt => 
            opt.textContent.includes('devmio')
          );
          
          if (devmioOption) {
            cy.wrap(devmioOption).click();
          } else {
            // Fallback: click first option
            cy.wrap($options.first()).click();
          }
        }
      });
    cy.get('#frc-introText--918969944').type('This is a test introduction');
    cy.get('#frc-publicationFrequency-1046486578').type('100');
    
    // Click language dropdown - use the specific selector that works
    cy.get('.input-language > .jss278 > .jss294 > .jss326 > .jss327').first().click();
    
    // Wait for menu to render
    cy.wait(500);
    
    // Find and click option by text (same pattern as Apps dropdown)
    // Try English first, then German, otherwise any option
    cy.get('body').then(($body) => {
      // Check if English option exists
      const englishOption = $body.find('[role="option"]').filter((i, el) => 
        Cypress.$(el).text().includes('English')
      );
      
      if (englishOption.length > 0) {
        cy.wrap(englishOption.first()).click();
      } else {
        // Try German
        const germanOption = $body.find('[role="option"]').filter((i, el) => 
          Cypress.$(el).text().includes('German')
        );
        
        if (germanOption.length > 0) {
          cy.wrap(germanOption.first()).click();
        } else {
          // Fallback: click first option
          cy.get('[role="option"]').first().click();
        }
      }
    });

    cy.get('#frc-colour-1601995274').type('#000000');
    
    // Click conferenceSeriesId dropdown (same pattern as Apps dropdown)
    cy.get('.input-conferenceSeriesId .css-bg1rzq-control').first().click();
    
    // Wait for menu to render and find options by ID pattern
    cy.wait(500);
    
    // Find the option by ID pattern - try different react-select IDs
    cy.get('[id^="react-select-"][id*="-option-"]', { timeout: 10000 })
      .should('have.length.at.least', 1)
      .then(($options) => {
        // Click first available option
        cy.wrap($options.first()).click();
      });
    
    cy.wait(1000);
    
    // Save the brand form
    cy.get('button[type="submit"], button:contains("Save"), button:contains("Create"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .click();
    
    // Wait for success message or redirect
    cy.wait(2000); 

    
    // Step 2: Create Issue

    
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
    // Verify Brand - wait for page to load and find brand name
    cy.visit('/brands');
    cy.wait(2000); // Wait for list to load
    cy.get('body').should('be.visible');
    cy.contains(brandName, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    
    // Verify Issue - use flexible selector
    cy.visit('/issues');
    cy.contains(issueName, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    
    // Verify Author - use flexible selector
    cy.visit('/authors');
    cy.contains(authorName, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
    
    // Verify Article - use flexible selector
    cy.visit('/articles');
    cy.contains(articleTitle, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
  });
});
