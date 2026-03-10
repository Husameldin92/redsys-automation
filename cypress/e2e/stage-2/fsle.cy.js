describe('FSLE Creation and Management', () => {

  const timestamp = Date.now();
  const fsleName = `E2E FSLE ${timestamp}`;
  
  before(() => {
    cy.loginAs('admin');
  });
  
  it('should create a new FSLE', () => {
    cy.log('Creating FSLE');
    cy.visit('/live_events?option=blockbusters');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);
    
    cy.log('Clicking FSLES tab');
    cy.get('.subMenu > :nth-child(3) > .MuiButton-label-7')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait for FSLES section to load
    
    cy.log('Clicking NEW FSLE button');
    cy.get('body').then(($body) => {
      const newFSLEButton = $body.find('button:contains("NEW FSLE"), a:contains("NEW FSLE"), button:contains("New FSLE"), a:contains("New FSLE"), [data-testid*="new-fsle"], [data-testid*="fsle-new"]')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('new') && (text.includes('fsle') || text.includes('fs le'));
        });
      
      if (newFSLEButton.length > 0) {
        cy.wrap(newFSLEButton.first()).should('be.visible').click();
      } else {
        // Fallback: try common selectors
        cy.get('button[type="button"], a[href*="fsle"]').contains('NEW FSLE', { matchCase: false }).click();
      }
    });
    

    cy.log('Waiting for FSLE form to load');
    cy.wait(5000); 
    

    cy.get('input, textarea, select', { timeout: 15000 })
      .first()
      .should('exist');
    
    cy.wait(2000);
    

    cy.log('Scrolling down to see form fields');
    cy.scrollTo(0, 500);
    cy.wait(1000);
    
    // Fill Name field - scroll into view first
    cy.log('Filling Name');
    cy.get('#frc-name--1782415253')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(fsleName);
    
    // Fill Slogan field
    cy.log('Filling Slogan');
    cy.get('#frc-slogan--66047816')
      .should('be.visible')
      .clear()
      .type(`E2E FSLE Slogan ${timestamp}`);
    
    // Fill Description field
    cy.log('Filling Description');
    cy.get('#frc-description--837447522')
      .should('be.visible')
      .clear()
      .type(`This is a test description for E2E FSLE ${timestamp}`);
    
    // Select Access Type dropdown - choose FS (first option)
    cy.log('Selecting Access Type: FS');
    cy.selectReactSelectOption(
      '.input-courseAccessType > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3',
      'FS'
    );
    
    // Select Apps dropdown - choose first option
    cy.log('Selecting Apps');
    cy.selectReactSelectOption(
      '.input-supportedApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3',
      null // Will select first option
    );
    
    // Select Brand dropdown - use last created conference brand (same as tutorial)
    cy.log('Selecting Brand');
    cy.getLastCreatedConferenceBrand().then((brandName) => {
      cy.wait(1000);
      cy.selectReactSelectOption(
        '.css-1szy77t-control > .css-1hwfws3',
        brandName
      );
    });
    
    // Select Series dropdown - use the FSLE series from last created conference brand
    cy.log('Selecting Series');
    cy.getLastCreatedConferenceBrandSeries('FSLE').then((seriesName) => {
      cy.selectReactSelectOption(
        ':nth-child(4) > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3',
        seriesName
      );
    });
    
    // Select End Date (unpublishing date) at FSLE/course level
    cy.log('Selecting End Date from calendar');
    cy.get('.input-unpublishingDate input.form-control')
      .first()
      .should('be.visible')
      .scrollIntoView()
      .click();
    cy.wait(500);
    // Scope to this calendar only - click next month then first available day
    cy.get('.input-unpublishingDate .rdtNext').first().click();
    cy.wait(300);
    cy.get('.input-unpublishingDate .rdtDay:not(.rdtOld)').first().click();
    cy.wait(500);
    
    // Scroll down to see slug field (FSLE has extra field, need more scroll)
    cy.log('Scrolling to slug field');
    cy.scrollTo(0, 800);
    cy.wait(1000);
    
    // Fill Slug field - scroll into view first
    cy.log('Filling Slug');
    cy.get('#frc-slug-1053376469')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(fsleName.toLowerCase().replace(/ /g, '-'));
    
    // Fill Colour code field
    cy.log('Filling Colour Code');
    cy.get('body').then(($body) => {
      const colourCodeField = $body.find('input[id*="colour"], input[id*="color"], input[name*="colour"], input[name*="color"]')
        .not('#frc-slug-1053376469')
        .not('#frc-headlineColourHexCode-616139814')
        .first();
      
      if (colourCodeField.length > 0) {
        cy.wrap(colourCodeField).clear().type('#000000');
      }
    });
    
    // Fill Colour hex field
    cy.log('Filling Colour Hex');
    cy.get('#frc-headlineColourHexCode-616139814')
      .should('be.visible')
      .clear()
      .type('#000000');
    
    cy.wait(500);
    
    // Save the FSLE (Speichern)
    cy.log('Saving FSLE');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    cy.wait(2000);
    
    // Store the FSLE name for use in other tests
    cy.storeLastCreatedFSLE(fsleName);
    
    // Navigate back to FSLEs list
    cy.log('Opening FSLE to add lessons');
    cy.visit('/live_events?option=blockbusters');
    cy.wait(2000);
    
    // Click FSLES tab again to show FSLEs list
    cy.log('Clicking FSLES tab');
    cy.get('.subMenu > :nth-child(3) > .MuiButton-label-7')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait for FSLES section to load
    
    // Search for the created FSLE using search field
    cy.log('Searching for FSLE');
    cy.get('.datatable-search')
      .should('be.visible')
      .clear()
      .type(fsleName);
    
    cy.wait(2000); // Wait for search results
    
    // Find and click on the created FSLE from search results
    cy.contains(fsleName, { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();
    
    cy.wait(2000); // Wait for FSLE detail page to load
    
    // Click on Lessons tab
    cy.log('Clicking Lessons tab');
    cy.get('[style="margin-top: 2%; margin-left: 0.5%; margin-right: 0.5%;"] > :nth-child(1) > :nth-child(2) > .jss7')
      .should('be.visible')
      .click();
    
    cy.wait(2000); 
    
    // Click New Lesson button
    cy.log('Clicking New Lesson button');
    cy.get('.modal-trigger > .jss32 > .jss7')
      .should('be.visible')
      .click();
    
    cy.wait(3000); 
    

    cy.log('Filling Lesson Name');
    cy.get('body').then(($body) => {
      const nameField = $body.find('input[id*="name"], input[name*="name"]')
        .not('[type="hidden"]')
        .first();
      
      if (nameField.length > 0) {
        cy.wrap(nameField)
          .scrollIntoView()
          .should('be.visible')
          .clear()
          .type(`E2E Lesson ${timestamp}`);
      } else {
        // Fallback: try common name field selectors
        cy.get('input[type="text"]').first().clear().type(`E2E Lesson ${timestamp}`);
      }
    });
    
    // Fill Description field
    cy.log('Filling Lesson Description');
    cy.get('#frc-description--837447522')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(`This is a test description for E2E Lesson ${timestamp}`);
    

    cy.log('Selecting Language: English');
    cy.get('.input-language > .jss347 > .jss390 > .jss420 > .jss421')
      .should('be.visible')
      .scrollIntoView()
      .click();
    
    cy.wait(1000);
    
    // Use helper but handle empty first option
    cy.get('body').then(($body) => {
      const languageOptions = $body.find('[role="option"]');
      const englishOption = languageOptions.filter((i, el) => {
        return Cypress.$(el).text().toLowerCase().includes('english');
      });
      
      if (englishOption.length > 0) {
        cy.wrap(englishOption.first()).click();
      } else if (languageOptions.length >= 2) {
        // Skip first empty option, select second
        cy.wrap(languageOptions.eq(1)).click();
      } else {
        cy.wrap(languageOptions.first()).click();
      }
    });
    
    // Select Start Date from calendar
    cy.log('Selecting Start Date from calendar');
    cy.get('.input-startDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control')
      .should('be.visible')
      .scrollIntoView()
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
    
    
    cy.wait(1000);
    
    // Select Video Type dropdown - choose NONE (JSS classes change; use stable .input-videoType + fallbacks)
    cy.log('Selecting Video Type: NONE');
    cy.get('.input-videoType [role="combobox"], .input-videoType [role="button"], .input-videoType .MuiSelect-select, .input-videoType > div > div')
      .first()
      .scrollIntoView()
      .click();
    cy.wait(500);
    cy.get('[role="option"]').filter((i, el) => Cypress.$(el).text().includes('NONE')).first().click();
    
    // Save the lesson (Speichern)
    cy.log('Saving lesson');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    
    // Wait for save to complete
    cy.wait(2000);
    

    cy.log('Clicking General Information button');
    cy.get('[style="margin-top:2%;margin-left:.5%;margin-right:.5%"] > :nth-child(1) > :nth-child(1) > .MuiButton-label-7')
      .should('be.visible')
      .click();
    
    cy.wait(2000); 
    
    // Click Revise button
    cy.log('Clicking Revise button');
    cy.get(':nth-child(4) > :nth-child(1) > .jss7')
      .should('exist')
      .click({ force: true }); // Force click to handle overlay coverage
    
    cy.wait(3000); // Wait a bit after clicking revise
    
    // Click the same button again to publish
    cy.log('Clicking publish button');
    cy.get(':nth-child(4) > :nth-child(1) > .jss7')
      .should('exist')
      .click({ force: true }); // Force click to handle overlay coverage
    
    cy.wait(2000); // Wait after publishing
    
    cy.log(`✅ FSLE "${fsleName}" created with lesson and published successfully`);
  });
});
