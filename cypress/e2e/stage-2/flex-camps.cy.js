describe('Flex Camps Creation and Management', () => {

  const timestamp = Date.now();
  const flexCampsName = `E2E Flex Camps ${timestamp}`;
  
  before(() => {
    cy.loginAs('admin');
  });
  
  it('should create a new Flex Camps', () => {
    cy.log('Creating Flex Camps');
    cy.visit('/live_events?option=blockbusters');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);
    
    // Click Flex Camps tab first
    cy.log('Clicking Flex Camps tab');
    cy.get('.subMenu > :nth-child(5) > .MuiButton-label-7')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait for Flex Camps section to load
    
    cy.log('Clicking NEW FLEX CAMP button');
    cy.get('body').then(($body) => {
      const newFlexCampsButton = $body.find('button:contains("NEW FLEX CAMP"), a:contains("NEW FLEX CAMP"), button:contains("New Flex Camp"), a:contains("New Flex Camp"), button:contains("NEW FLEX CAMPS"), a:contains("NEW FLEX CAMPS"), [data-testid*="new-flex-camp"], [data-testid*="flex-camp-new"]')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('new') && (text.includes('flex') && (text.includes('camp') || text.includes('camps')));
        });
      
      if (newFlexCampsButton.length > 0) {
        cy.wrap(newFlexCampsButton.first()).should('be.visible').click();
      } else {
        // Fallback: try common selectors
        cy.get('button[type="button"], a[href*="flex"], a[href*="camp"]').contains(/NEW FLEX (CAMP|CAMPS)/i).click();
      }
    });
    

    cy.log('Waiting for Flex Camps form to load');
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
      .type(flexCampsName);
    
    // Fill Slogan field
    cy.log('Filling Slogan');
    cy.get('#frc-slogan--66047816')
      .should('be.visible')
      .clear()
      .type(`E2E Flex Camps Slogan ${timestamp}`);
    
    // Fill Description field
    cy.log('Filling Description');
    cy.get('#frc-description--837447522')
      .should('be.visible')
      .clear()
      .type(`This is a test description for E2E Flex Camps ${timestamp}`);
    
   
    
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
    
    // Select Series dropdown - use the FLEX_CAMP series from last created conference brand
    cy.log('Selecting Series');
    cy.getLastCreatedConferenceBrandSeries('FLEX_CAMP').then((seriesName) => {
      cy.selectReactSelectOption(
        ':nth-child(4) > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3',
        seriesName
      );
    });
    


    // Scroll down to see slug field
    cy.log('Scrolling to slug field');
    cy.scrollTo(0, 800);
    cy.wait(1000);
    
    // Fill Slug field - scroll into view first
    cy.log('Filling Slug');
    cy.get('#frc-slug-1053376469')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(flexCampsName.toLowerCase().replace(/ /g, '-'));
    
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
    
    // Save the Flex Camps (Speichern)
    cy.log('Saving Flex Camps');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    cy.wait(2000);
    
    // Store the Flex Camps name for use in other tests
    cy.storeLastCreatedFlexCamps(flexCampsName);
    
    // Navigate back to Flex Camps list
    cy.log('Opening Flex Camps to add lessons');
    cy.visit('/live_events?option=blockbusters');
    cy.wait(2000);
    
    // Click Flex Camps tab again to show Flex Camps list
    cy.log('Clicking Flex Camps tab');
    cy.get('.subMenu > :nth-child(5) > .MuiButton-label-7')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait for Flex Camps section to load
    
    // Search for the created Flex Camps using search field
    cy.log('Searching for Flex Camps');
    cy.get('.datatable-search')
      .should('be.visible')
      .clear()
      .type(flexCampsName);
    
    cy.wait(2000); // Wait for search results
    
    // Find and click on the created Flex Camps from search results
    cy.contains(flexCampsName, { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();
    
    cy.wait(2000); // Wait for Flex Camps detail page to load
    
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
    
    cy.log(`✅ Flex Camps "${flexCampsName}" created with lesson and published successfully`);
  });
});
