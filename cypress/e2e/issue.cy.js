describe('Issue Creation', () => {
  // Generate unique identifier for test data
  const timestamp = Date.now();
  const issueName = `E2E Issue ${timestamp}`;
  let brandName;
  
  before(() => {
    // Login once before all tests
    cy.loginAs('admin');
    
    // Get the last created brand from the brand test
    cy.getLastCreatedBrand().then((name) => {
      brandName = name;
    });
  });
  
  it('should create a new issue and connect it to the last created brand', () => {
    cy.log('Creating Issue');
    cy.visit('/issues');
    cy.contains('Not Allowed').should('not.exist');
    
    // Get the brand name (in case it wasn't set in before hook)
    cy.getLastCreatedBrand().then((name) => {
      const brandToUse = brandName || name;
      cy.log(`Using brand: ${brandToUse}`);
      
      // Click create button
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
          cy.get('a[href*="issue"], button[type="button"]').first().click();
        }
      });
      
      // Wait for form to load
      cy.wait(2000);
      
      // Select brand from dropdown (connect to last created brand)
      cy.log(`Selecting brand: ${brandToUse}`);
      cy.get('body').then(($body) => {
        // Try React Select pattern first
        const brandSelect = $body.find('.input-brand .css-bg1rzq-control, [data-testid*="brand-select"] .css-bg1rzq-control, select[name*="brand"], select[id*="brand"]');
        
        if (brandSelect.length > 0) {
          // It's a React Select
          cy.selectReactSelectOption(brandSelect.selector || '.input-brand .css-bg1rzq-control', brandToUse);
        } else {
          // Regular select dropdown
          cy.get('select[name*="brand"], select[id*="brand"]').select(brandToUse);
        }
      });
      
      // Fill issue name field
      cy.get('body').then(($body) => {
        const nameInput = $body.find('input[name*="name"], input[id*="name"], input[placeholder*="name"], input[placeholder*="Name"], [data-testid*="issue-name"], [data-testid*="name-input"]')
          .not('[type="hidden"]')
          .first();
        
        if (nameInput.length > 0) {
          cy.wrap(nameInput).clear().type(issueName);
        } else {
          // Fallback: try to find any text input and fill it
          cy.get('input[type="text"]').first().clear().type(issueName);
        }
      });
      
      // TODO: Add more issue form fields here (description, images, etc.)
      
      // Save the issue
      cy.log('Saving issue');
      cy.get('button[type="submit"], button:contains("Save"), button:contains("Create"), [data-testid*="save"], [data-testid*="submit"]')
        .first()
        .scrollIntoView()
        .click();
      
      // Wait for save to complete
      cy.wait(2000);
      
      // Verify success
      cy.url().should('not.include', '/login');
      cy.url().should('not.include', '/auth');
      cy.get('body').should('not.contain', 'Not Allowed');
      
      cy.log(`✅ Issue "${issueName}" created and connected to brand "${brandToUse}"`);
    });
  });
  
  it('should verify issue exists in list', () => {
    cy.visit('/issues');
    cy.wait(2000);
    cy.contains(issueName, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
  });
});
