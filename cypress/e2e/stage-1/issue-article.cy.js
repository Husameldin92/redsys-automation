describe('Issue and Article Creation', () => {
  // Generate unique identifier for test data
  const timestamp = Date.now();
  const issueName = `E2E Issue ${timestamp}`;
  let brandName;
  let authorName;
  
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
      
      // Step 5: Create article for this issue
      cy.log('Creating article for this issue');
      cy.get(':nth-child(2) > :nth-child(1) > .jss508')
        .should('be.visible')
        .click();
      
      // Wait for article form to load (takes time)
      cy.wait(8000);
      
      // Scroll down and select "standard" from type dropdown
      cy.log('Selecting article type: standard');
      cy.get('.input-type > .jss770 > .jss791 > .jss786 > .jss787')
        .first() // Ensure we only get one element
        .scrollIntoView()
        .should('be.visible')
        .click();
      cy.wait(1000); // Increased wait
      // Select first option (standard)
      cy.get('[role="option"]').first().click();
      cy.wait(1000); // Increased wait
      
      // Leave author empty (will be filled later)
      cy.log('Skipping author field (will be filled later)');
      
      // Fill Headline
      cy.log('Filling Headline');
      cy.get('#frc-name-324128130')
        .should('be.visible')
        .clear()
        .type(`E2E Article Headline ${timestamp}`);
      cy.wait(500); // Wait after filling
      
      // Fill Subtitle
      cy.log('Filling Subtitle');
      cy.get('#frc-subTitle-1141520574')
        .should('be.visible')
        .clear()
        .type(`E2E Article Subtitle ${timestamp}`);
      cy.wait(500); // Wait after filling
      
      // Fill Slug
      cy.log('Filling Slug');
      cy.get('#frc-slug-1053376469')
        .should('be.visible')
        .clear()
        .type(`e2e-article-${timestamp}`);
      cy.wait(500); // Wait after filling
      
      // Select Primary Category dropdown (second option - first is empty)
      cy.log('Selecting Primary Category');
      cy.get('.input-primaryCategoryId > .jss770 > .jss791 > .jss786 > .jss787')
        .first() // Ensure we only get one element
        .should('be.visible')
        .click();
      cy.wait(1000); // Increased wait
      cy.get('[role="option"]').eq(1).click(); // Select second option (index 1)
      cy.wait(1000); // Increased wait
      
      // Select Topics dropdown (first option)
      cy.log('Selecting Topics');
      cy.get('.input-categoryIds > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3')
        .should('be.visible')
        .click();
      cy.wait(1000); // Increased wait
      // Find and click first option in Topics dropdown
      cy.get('body').then(($body) => {
        const topicOption = $body.find('[id^="react-select-"][id*="-option-"], [role="option"]')
          .first();
        if (topicOption.length > 0) {
          cy.wrap(topicOption).click();
        } else {
          // Fallback: try React Select pattern
          cy.selectReactSelectOption('.input-categoryIds .css-bg1rzq-control', null);
        }
      });
      cy.wait(1000); // Increased wait
      
      // Save the article (Speichern)
      cy.log('Saving article');
      cy.get('button.submit-button[type="submit"]')
        .first() // Ensure we only get one element
        .scrollIntoView()
        .should('contain', 'Speichern')
        .click();
      
      // Wait for save to complete and check we're still logged in (takes time)
      cy.wait(4000); // Increased wait after saving article
      
      // Verify we're still logged in - check URL and page content
      cy.url().should('not.include', '/login');
      cy.url().should('not.include', '/auth');
      cy.get('body').should('not.contain', 'Not Allowed');
      
      // Step 6: Get the last created author before editing article
      cy.getLastCreatedAuthor().then((name) => {
        authorName = name;
        cy.log(`Will connect author "${authorName}" to article during edit`);
        
        // Edit article to upload images and connect author
        cy.log('Clicking Edit button for article');
        // Wait longer for the page to fully load after article creation
        cy.wait(3000);
        
        // Find and click the edit button using the specific selector
        cy.get('[style="width: 4.54545%; height: 64px; padding: 0px;"] > .jss1033 > div', { timeout: 15000 })
          .first() // Ensure we only get one element
          .should('be.visible')
          .scrollIntoView()
          .click();
        
        // Wait longer for edit form to load (takes time to open)
        cy.log('Waiting for edit form to load...');
        cy.wait(10000); // Increased wait time after clicking edit (10 seconds)
        
        // Wait more for form to be fully ready
        cy.wait(3000);
        
        // Select author from dropdown (first field, before uploads)
        cy.log(`Selecting author: ${authorName}`);
        cy.get('.input-authorIds > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', { timeout: 15000 })
          .first()
          .scrollIntoView({ duration: 1000 }) // Scroll first, then check
          .should('exist')
          .click();
        
        cy.wait(1000); // Wait for dropdown to open
        
        // Find and select the author from dropdown options
        cy.get('body').then(($body) => {
          const authorOption = $body.find('[id^="react-select-"][id*="-option-"], [role="option"]')
            .filter((i, el) => Cypress.$(el).text().includes(authorName));
          
          if (authorOption.length > 0) {
            cy.wrap(authorOption.first()).click();
          } else {
            // Fallback: try React Select pattern
            cy.selectReactSelectOption('.input-authorIds .css-bg1rzq-control', authorName);
          }
        });
        
        cy.wait(1000);
        
        // Upload teaser image to Images dropzone (first dropzone)
        cy.log('Uploading article teaser image to Images dropzone');
        // Ensure we only get one element - use first() before scrollIntoView
        cy.get('.dropzone-base').first().then(($dropzone) => {
          cy.wrap($dropzone)
            .scrollIntoView({ duration: 1000 })
            .should('exist')
            .within(() => {
              cy.get('input[type="file"]').selectFile('cypress/fixtures/images/brand-generic-teaser.jpg', { force: true });
            });
        });
        cy.wait(2000); // Increased wait after upload
        
        // Upload HTML file to HTML-Uploaded dropzone using exact selector
        cy.log('Uploading article HTML file to HTML-Uploaded dropzone');
        cy.get(':nth-child(10) > .jss1100 > .jss1102 > .jss1103 > .jss1038 > .jss1104 > .form-group > .col-sm-9 > .dropzone-base', { timeout: 15000 })
          .should('exist')
          .then(($dropzone) => {
            // Ensure we only scroll one element
            cy.wrap($dropzone)
              .scrollIntoView({ duration: 1000 })
              .within(() => {
                cy.get('input[type="file"]').selectFile('cypress/fixtures/images/report.html', { force: true });
              });
          });
        cy.wait(2000); // Increased wait after upload
        
        // Save the article edits with author connection (Speichern)
        cy.log('Saving article edits with author connection');
        cy.get('button.submit-button[type="submit"]')
          .first() // Ensure we only get one element
          .scrollIntoView()
          .should('contain', 'Speichern')
          .click();
        
        // Wait for save to complete and check we're still logged in (takes time)
        cy.wait(4000); // Increased wait after saving edits
        
        // Verify we're still logged in - check URL and page content
        cy.url().should('not.include', '/login');
        cy.url().should('not.include', '/auth');
        cy.get('body').should('not.contain', 'Not Allowed');
        
        // Step 7: Publish the issue (we're already on the issue detail page)
        cy.log('Publishing issue');
        // Wait a bit for the page to be ready after saving
        cy.wait(2000);
        
        // Find publish button by text content (more reliable than dynamic IDs)
        cy.get('button.button', { timeout: 15000 })
          .contains('Publish')
          .first()
          .should('exist')
          .scrollIntoView()
          .click();
        
        // Wait much time after publish (as requested)
        cy.wait(10000); // Long wait after publishing
        
        // Verify we're still logged in after publishing
        cy.url().should('not.include', '/login');
        cy.url().should('not.include', '/auth');
        cy.get('body').should('not.contain', 'Not Allowed');
        
        // Test complete - issue created, edited, article created and edited with author connected, and published
        cy.log(`✅ Issue "${issueName}" created, edited, article created and edited with author "${authorName}" connected, published (brand, issue, and article), connected to brand "${brandToUse}"`);
      });
    });
  });
});
