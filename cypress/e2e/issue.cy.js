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
      cy.get('.jss297')
        .should('be.visible')
        .click();
      
      // Wait for brand dropdown to open
      cy.wait(500);
      
      // Find and select the brand from the dropdown options
      cy.get('body').then(($body) => {
        // Try to find the brand option in the dropdown
        const brandOption = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]')
          .filter((i, el) => Cypress.$(el).text().includes(brandToUse));
        
        if (brandOption.length > 0) {
          cy.wrap(brandOption.first()).click();
        } else {
          // Fallback: try React Select pattern
          cy.selectReactSelectOption('.jss297', brandToUse);
        }
      });
      
      cy.wait(500);
      
      // Fill Designation field
      cy.log('Filling Designation');
      cy.get('#frc-designation--1687261501')
        .should('be.visible')
        .clear()
        .type(`E2E Issue Designation ${timestamp}`);
      
      // Fill Slug field
      cy.log('Filling Slug');
      cy.get('#frc-slug--1317495733')
        .should('be.visible')
        .clear()
        .type(issueName.toLowerCase().replace(/ /g, '-'));
      
      // Fill Cover story field
      cy.log('Filling Cover story');
      cy.get('#frc-topic-2025887566')
        .should('be.visible')
        .clear()
        .type('test');
      
      // Fill In-app purchase ID field
      cy.log('Filling In-app purchase ID');
      cy.get('#frc-inAppPurchaseId--659886845')
        .should('be.visible')
        .clear()
        .type('12345');
      
      // Fill Publication start date - select from calendar widget
      cy.log('Selecting Publication start date from calendar');
      
      // Click the date field to open the calendar
      cy.get('.rdt > .form-control')
        .should('be.visible')
        .click();
      
      // Wait for calendar to appear
      cy.wait(500);
      
      // Try to find and click today's date (has class rdtToday)
      cy.get('body').then(($body) => {
        const todayDate = $body.find('.rdtDay.rdtToday');
        
        if (todayDate.length > 0) {
          // Click today's date
          cy.wrap(todayDate.first()).click();
          cy.log('Selected today\'s date from calendar');
        } else {
          // If today's date not found, click the first available date (not rdtOld)
          cy.get('.rdtDay:not(.rdtOld)')
            .first()
            .click();
          cy.log('Selected first available date from calendar');
        }
      });
      
      // Wait for calendar to close and date to be set
      cy.wait(1000);
      
      // Verify the date field has a value (date was selected)
      cy.get('.rdt > .form-control')
        .should('not.have.value', '');
      
      // Save the issue (using same logic as brand test)
      cy.log('Saving issue');
      cy.get('button.submit-button[type="submit"]')
        .scrollIntoView()
        .should('contain', 'Speichern')
        .click();
      
      // Wait for save to complete and check we're still logged in
      cy.wait(2000);
      
      // Verify we're still logged in - check URL and page content
      cy.url().should('not.include', '/login');
      cy.url().should('not.include', '/auth');
      cy.get('body').should('not.contain', 'Not Allowed');
      
      // Step 2: Click Edit button to enter edit mode (we should already be on issue detail page)
      cy.log('Clicking Edit button');
      cy.get(':nth-child(4) > :nth-child(1) > .modal-trigger > .jss508')
        .first()
        .should('be.visible')
        .click();
      
      // Wait for edit form to load
      cy.wait(2000);
      
      // Step 3: Upload cover image (scroll down first)
      cy.log('Uploading issue cover image');
      cy.get('.input-cover > .form-group > .col-sm-9 > .dropzone-base')
        .scrollIntoView()
        .within(() => {
          cy.get('input[type="file"]').selectFile('cypress/fixtures/images/issue-cover.jpg', { force: true });
        });
      cy.wait(1000); // Wait for upload to complete
      
      // Step 4: Save changes - click "Speichern" button
      cy.log('Saving issue edits');
      cy.get('button.submit-button[type="submit"]')
        .scrollIntoView()
        .should('contain', 'Speichern')
        .click();
      
      // Wait for save to complete and check we're still logged in
      cy.wait(2000);
      
      // Verify we're still logged in - check URL and page content
      cy.url().should('not.include', '/login');
      cy.url().should('not.include', '/auth');
      cy.get('body').should('not.contain', 'Not Allowed');
      
      // Test complete - issue created and edited successfully, still logged in
      cy.log(`✅ Issue "${issueName}" created, edited, and connected to brand "${brandToUse}"`);
    });
  });
});
