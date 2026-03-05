describe('Tutorial Creation and Management', () => {

  const timestamp = Date.now();
  const tutorialName = `E2E Tutorial ${timestamp}`;
  
  before(() => {
    cy.loginAs('admin');
  });
  
  it('should create a new tutorial', () => {
    cy.log('Creating Tutorial');
    cy.visit('/live_events?option=blockbusters');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);
    
    
    cy.log('Clicking NEW TUTORIAL button');
    cy.get('body').then(($body) => {
      const newTutorialButton = $body.find('button:contains("NEW TUTORIAL"), a:contains("NEW TUTORIAL"), button:contains("New Tutorial"), a:contains("New Tutorial"), [data-testid*="new-tutorial"], [data-testid*="tutorial-new"]')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('new') && text.includes('tutorial');
        });
      
      if (newTutorialButton.length > 0) {
        cy.wrap(newTutorialButton.first()).should('be.visible').click();
      } else {
        // Fallback: try common selectors
        cy.get('button[type="button"], a[href*="tutorial"]').contains('NEW TUTORIAL', { matchCase: false }).click();
      }
    });
    

    cy.log('Waiting for tutorial form to load');
    cy.wait(5000); 
    

    cy.get('input, textarea, select', { timeout: 15000 })
      .first()
      .should('exist');
    
    cy.wait(2000);
    
    // Scroll down to see the form fields
    cy.log('Scrolling down to see form fields');
    cy.scrollTo(0, 500);
    cy.wait(1000);
    
    // Fill Name field - scroll into view first
    cy.log('Filling Name');
    cy.get('#frc-name--1782415253')
      .scrollIntoView()
      .should('be.visible')
      .clear()
      .type(tutorialName);
    
    // Fill Slogan field
    cy.log('Filling Slogan');
    cy.get('#frc-slogan--66047816')
      .should('be.visible')
      .clear()
      .type(`E2E Tutorial Slogan ${timestamp}`);
    
    // Fill Description field
    cy.log('Filling Description');
    cy.get('#frc-description--837447522')
      .should('be.visible')
      .clear()
      .type(`This is a test description for E2E Tutorial ${timestamp}`);
    
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
    
    // Select Brand dropdown - use last created conference brand
    cy.log('Selecting Brand');
    cy.getLastCreatedConferenceBrand().then((brandName) => {
      // Wait for any overlay to potentially disappear
      cy.wait(1000);
      
      // Use helper function to select brand
      cy.selectReactSelectOption(
        '.css-1szy77t-control > .css-1hwfws3',
        brandName
      );
    });
    
    // Select Series dropdown - use the tutorial series we created
    cy.log('Selecting Series');
    cy.selectReactSelectOption(
      ':nth-child(4) > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3',
      'Tutorial'
    );
    
    // Scroll down to see slug field
    cy.log('Scrolling to slug field');
    cy.scrollTo(0, 600);
    cy.wait(1000);
    
    // Fill Slug field
    cy.log('Filling Slug');
    cy.get('#frc-slug-1053376469')
      .should('be.visible')
      .clear()
      .type(tutorialName.toLowerCase().replace(/ /g, '-'));
    
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
    
    // Save the tutorial (Speichern)
    cy.log('Saving tutorial');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    cy.wait(2000);
    
    // Find and click on the created tutorial from search results
    cy.contains(tutorialName, { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();
    
    cy.wait(2000); // Wait for tutorial detail page to load
    
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
    
    // Select Language dropdown - choose English (skip first empty option)
    cy.log('Selecting Language: English');
    cy.get('.input-language > .jss479 > .jss522 > .jss552 > .jss553')
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
    
    // Select Video Type dropdown - choose NONE
    cy.log('Selecting Video Type: NONE');
    cy.selectReactSelectOptionByRole(
      '.input-videoType > .jss479 > .jss522 > .jss552 > .jss553',
      'NONE'
    );
    
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
    
    cy.log(`✅ Tutorial "${tutorialName}" created with lesson and published successfully`);
  });
});
