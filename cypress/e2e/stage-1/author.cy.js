describe('Author Creation', () => {
  // Generate unique identifier for test data
  const timestamp = Date.now();
  const authorName = `E2E Author ${timestamp}`;
  
  before(() => {
    // Login once before all tests
    cy.loginAs('admin');
  });
  
  it('should create a new author, publish it, and store it for article connection', () => {
    cy.log('Creating Author');
    cy.visit('/authors');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);
    
    // Click create author button
    cy.get('body').then(($body) => {
      const createButton = $body.find('a:contains("Create"), button:contains("Create"), a:contains("New"), button:contains("New"), [data-testid*="create"], [data-testid*="new"]')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('create') || text.includes('new');
        });
      
      if (createButton.length > 0) {
        cy.wrap(createButton.first()).should('be.visible').click();
      } else {
        // Fallback: try common selectors
        cy.get('a[href*="author"], button[type="button"]').first().click();
      }
    });
    
    // Wait for author form to load
    cy.wait(2000);
    
    // Fill author name
    cy.log('Filling author name');
    cy.get('body').then(($body) => {
      const nameInput = $body.find('input[name*="name"], input[id*="name"], input[placeholder*="name"], input[placeholder*="Name"], [data-testid*="author-name"], [data-testid*="name-input"]')
        .not('[type="hidden"]')
        .first();
      
      if (nameInput.length > 0) {
        cy.wrap(nameInput).clear().type(authorName);
      } else {
        // Fallback: try to find any text input and fill it
        cy.get('input[type="text"]').first().clear().type(authorName);
      }
    });
    
    // Fill slug
    cy.log('Filling slug');
    cy.get('#frc-slug--1317495733')
      .should('be.visible')
      .clear()
      .type(authorName.toLowerCase().replace(/ /g, '-'));
    
    // Fill forname
    cy.log('Filling forname');
    cy.get('#frc-forename-283834671', { timeout: 10000 })
      .should('be.visible')
      .clear()
      .type('John');
    
    // Fill surname
    cy.log('Filling surname');
    cy.get('#frc-surname-1717441631')
      .should('be.visible')
      .clear()
      .type('Doe');
    
    // Fill company
    cy.log('Filling company');
    cy.get('#frc-company--1859029625')
      .should('be.visible')
      .clear()
      .type('Test Company');
    
    // Fill external bio German
    cy.log('Filling external bio German');
    cy.get('#frc-summary-1733255673')
      .should('be.visible')
      .clear()
      .type('Dies ist eine Test-Biografie auf Deutsch');
    
    // Fill external bio English
    cy.log('Filling external bio English');
    cy.get('#frc-summaryEn-249260577')
      .should('be.visible')
      .clear()
      .type('This is a test biography in English');
    
    // Save the author (Speichern)
    cy.log('Saving author');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Create"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    
    // Wait for save to complete
    cy.wait(3000);
    
    // Store the author name for use in article connection
    cy.storeLastCreatedAuthor(authorName);
    
    // Step 2: Edit author to upload avatar
    cy.log('Editing author to upload avatar');
    // Wait a bit for the page to load
    cy.wait(2000);
    
    // Find and click edit button using the specific selector
    cy.get('.jss475', { timeout: 10000 })
      .first()
      .should('be.visible')
      .scrollIntoView()
      .click();
    
    // Wait for edit form to load
    cy.wait(3000);
    
    // Upload avatar image
    cy.log('Uploading author avatar');
    cy.get('.input-avatarSquare > .form-group > .col-sm-9 > .small-image-base')
      .scrollIntoView()
      .should('exist')
      .within(() => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/images/author-avatar.jpg', { force: true });
      });
    
    cy.wait(8000); // Wait for upload to complete (5-8 seconds as requested)
    
    // Save the author edits (Speichern)
    cy.log('Saving author edits');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    
    cy.wait(3000); // Wait for save to complete
    
    // Publish or republish the author
    cy.log('Publishing/Republishing author');
    cy.get('.jss7', { timeout: 10000 })
      .first()
      .should('be.visible')
      .scrollIntoView()
      .click();
    
    cy.wait(3000); // Wait after publishing
    
    // Verify we're still logged in - check page content only
    cy.get('body').should('not.contain', 'Not Allowed');
    
    // Test complete - author created, published, and stored successfully
    cy.log(`✅ Author "${authorName}" created, published, and stored for article connection`);
  });
});
