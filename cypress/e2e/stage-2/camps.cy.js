describe('Camps Creation and Management', () => {

  const timestamp = Date.now();
  const campsName = `E2E Camps ${timestamp}`;
  
  before(() => {
    cy.loginAs('admin');
  });
  
  it('should create a new Camps', () => {
    cy.log('Creating Camps');
    cy.visit('/live_events?option=blockbusters');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);
    
    // Click Camps tab first
    cy.log('Clicking Camps tab');
    cy.get('.subMenu > :nth-child(4) > .MuiButton-label-7')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait for Camps section to load
    
    cy.log('Clicking NEW CAMP button');
    cy.get('body').then(($body) => {
      const newCampsButton = $body.find('button:contains("NEW CAMP"), a:contains("NEW CAMP"), button:contains("New Camp"), a:contains("New Camp"), button:contains("NEW CAMPS"), a:contains("NEW CAMPS"), [data-testid*="new-camp"], [data-testid*="camp-new"]')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('new') && (text.includes('camp') || text.includes('camps'));
        });
      
      if (newCampsButton.length > 0) {
        cy.wrap(newCampsButton.first()).should('be.visible').click();
      } else {
        // Fallback: try common selectors
        cy.get('button[type="button"], a[href*="camp"]').contains(/NEW (CAMP|CAMPS)/i).click();
      }
    });
    

    cy.log('Waiting for Camps form to load');
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
      .type(campsName);
    
    // Fill Slogan field
    cy.log('Filling Slogan');
    cy.get('#frc-slogan--66047816')
      .should('be.visible')
      .clear()
      .type(`E2E Camps Slogan ${timestamp}`);
    
    // Fill Description field
    cy.log('Filling Description');
    cy.get('#frc-description--837447522')
      .should('be.visible')
      .clear()
      .type(`This is a test description for E2E Camps ${timestamp}`);
    
   
    
    // Select Apps dropdown - choose first option
    cy.log('Selecting Apps');
    cy.selectReactSelectOption(
      '.input-supportedApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3',
      null // Will select first option
    );
    
    // Select Brand dropdown - use last created conference brand
    cy.log('Selecting Brand');
    cy.getLastCreatedConferenceBrand().then((brandName) => {
      cy.wait(1000);
      cy.selectReactSelectOption(
        '.css-1szy77t-control > .css-1hwfws3',
        brandName
      );
    });
    
    // Select Series dropdown - use the CAMP series from last created conference brand
    cy.log('Selecting Series');
    cy.getLastCreatedConferenceBrandSeries('CAMP').then((seriesName) => {
      cy.selectReactSelectOption(
        ':nth-child(4) > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3',
        seriesName
      );
    });
    


    // Scroll down to see slug field (Camps has extra field, need more scroll)
    cy.log('Scrolling to slug field');
    cy.scrollTo(0, 800);
    cy.wait(1000);
    
    // Fill Slug field - scroll into view first
    cy.log('Filling Slug');
    cy.get('#frc-slug-1053376469')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(campsName.toLowerCase().replace(/ /g, '-'));
    
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
    
    // Save the Camps (Speichern)
    cy.log('Saving Camps');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    cy.wait(2000);
    
    // Store the Camps name for use in other tests
    cy.storeLastCreatedCamps(campsName);
    
    // Navigate back to Camps list
    cy.log('Opening Camps to add lessons');
    cy.visit('/live_events?option=blockbusters');
    cy.wait(2000);
    
    // Click Camps tab again to show Camps list
    cy.log('Clicking Camps tab');
    cy.get('.subMenu > :nth-child(4) > .MuiButton-label-7')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait for Camps section to load
    
    // Search for the created Camps using search field
    cy.log('Searching for Camps');
    cy.get('.datatable-search')
      .should('be.visible')
      .clear()
      .type(campsName);
    
    cy.wait(2000); // Wait for search results
    
    // Find and click on the created Camps from search results
    cy.contains(campsName, { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();
    
    cy.wait(2000); // Wait for Camps detail page to load
    
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
    
    cy.get('body').then(($body) => {
      const languageOptions = $body.find('[role="option"]');
      const englishOption = languageOptions.filter((i, el) => {
        return Cypress.$(el).text().toLowerCase().includes('english');
      });
      
      if (englishOption.length > 0) {
        cy.wrap(englishOption.first()).click();
      } else if (languageOptions.length >= 2) {
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
    
    cy.wait(500);
    
    cy.get('body').then(($body) => {
      const todayDate = $body.find('.rdtDay.rdtToday');
      
      if (todayDate.length > 0) {
        cy.wrap(todayDate.first()).click();
        cy.log('Selected today\'s date from calendar');
      } else {
        cy.get('.rdtDay:not(.rdtOld)')
          .first()
          .click();
        cy.log('Selected first available date from calendar');
      }
    });
    
    // Select End Date from calendar (lesson level)
    cy.log('Selecting End Date from calendar');
    cy.get('.input-endDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control')
      .should('be.visible')
      .scrollIntoView()
      .click();
    cy.wait(500);
    cy.get('.input-endDate .rdtNext').first().click();
    cy.wait(500);
    cy.get('.input-endDate').then(($container) => {
      const todayDate = $container.find('.rdtDay.rdtToday');
      if (todayDate.length > 0) {
        cy.wrap(todayDate.first()).click();
      } else {
        cy.wrap($container.find('.rdtDay:not(.rdtOld)').first()).click();
      }
    });
    cy.wait(1000);
    
    // Select Video Type dropdown - choose NONE
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
      .click({ force: true });
    
    cy.wait(3000);
    
    // Click the same button again to publish
    cy.log('Clicking publish button');
    cy.get(':nth-child(4) > :nth-child(1) > .jss7')
      .should('exist')
      .click({ force: true });
    
    cy.wait(2000);
    
    cy.log(`✅ Camps "${campsName}" created with lesson and published successfully`);
  });
});
