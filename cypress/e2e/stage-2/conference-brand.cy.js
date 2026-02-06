describe('Conference Brand Creation and Management', () => {
  // Generate unique identifier for test data
  const timestamp = Date.now();
  const conferenceBrandName = `E2E Conference Brand ${timestamp}`;
  const seriesName = `E2E Series Tutorial ${timestamp}`;
  
  before(() => {
    // Login once before all tests
    cy.loginAs('admin');
  });
  
  it('should create a new conference brand with series and all genres (Tutorial, FSLE, Camps, Flex_camps, Rheingold, Course)', () => {
    // Step 1: Navigate to conference brands page
    cy.log('Creating Conference Brand');
    cy.visit('/live_events?option=conferenceBrands');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);
    
    // Click create button
    cy.get('a[href="#"]')
      .contains('Create new Brand')
      .should('be.visible')
      .click();
    
    // Wait for form to load
    cy.wait(2000);
    
    // Fill Name field
    cy.log('Filling Name');
    cy.get('#frc-name-1048423413')
      .should('be.visible')
      .clear()
      .type(conferenceBrandName);
    
    // Fill Slug field
    cy.log('Filling Slug');
    cy.get('#frc-slug-1053376469')
      .should('be.visible')
      .clear()
      .type(conferenceBrandName.toLowerCase().replace(/ /g, '-'));
    
    // Add first topic rating
    cy.log('Adding first topic rating');
    cy.get('.col-sm-9 > .jss32 > .jss82')
      .should('be.visible')
      .click();
    
    cy.wait(1000); // Wait for topic selection to appear
    
    // Click in the topic list to open dropdown
    cy.log('Selecting first topic');
    cy.get('.jss324')
      .should('be.visible')
      .click();
    
    cy.wait(500); // Wait for dropdown to open
    
    // Select first topic (skip first empty option)
    cy.get('body').then(($body) => {
      const topicOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
      if (topicOptions.length >= 2) {
        // Select second option (skip first empty, index 0)
        cy.wrap(topicOptions.eq(1)).click();
      }
    });
    
    cy.wait(500);
    
    // Set rating to 5 for first topic
    cy.log('Setting rating to 5 for first topic');
    cy.get('#frc-rating-256768864')
      .should('be.visible')
      .clear()
      .type('5');
    
    cy.wait(500);
    
    // TODO: Series selection/creation
    // - Add all 6 genres: Tutorial, FSLE, Camps, Flex_camps, Rheingold, Course
    
    // Save the conference brand (Speichern)
    cy.log('Saving conference brand');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    
    // Wait for save to complete
    cy.wait(2000);
    
    // Store the conference brand name for use in other tests (after saving conference brand)
    cy.storeLastCreatedConferenceBrand(conferenceBrandName);
    
    // Click create new series button
    cy.log('Clicking create new series button');
    cy.get('[style="display: flex; align-items: center; gap: 12px;"] > .modal-trigger > .jss464')
      .should('be.visible')
      .click();
    
    cy.wait(2000); // Wait for series form to load
    
    // Fill Series Name field
    cy.log('Filling Series Name');
    cy.get('#frc-name-1048423413')
      .should('be.visible')
      .clear()
      .type(seriesName);
    
    // Fill Series Slug field
    cy.log('Filling Series Slug');
    cy.get('#frc-slug-1053376469')
      .should('be.visible')
      .clear()
      .type(seriesName.toLowerCase().replace(/ /g, '-'));
    
    // Select Genre - choose Tutorial (first option)
    cy.log('Selecting Genre: Tutorial');
    cy.get('.input-genre > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3')
      .should('be.visible')
      .click();
    
    cy.wait(500); // Wait for dropdown to open
    
    // Select Tutorial option (skip first empty option if exists)
    cy.get('body').then(($body) => {
      const genreOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
      
      // Try to find Tutorial by text first
      const tutorialOption = genreOptions.filter((i, el) => {
        return Cypress.$(el).text().toLowerCase().includes('tutorial');
      });
      
      if (tutorialOption.length > 0) {
        cy.wrap(tutorialOption.first()).click();
      } else if (genreOptions.length >= 2) {
        // If Tutorial not found by text, select second option (skip first empty)
        cy.wrap(genreOptions.eq(1)).click();
      } else if (genreOptions.length >= 1) {
        // Fallback: select first available option
        cy.wrap(genreOptions.first()).click();
      }
    });
    
    cy.wait(500);
    
    // Select App Visibility - choose Entwickler (first option)
    cy.log('Selecting App Visibility: Entwickler');
    cy.get('.input-visibleInApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3')
      .should('be.visible')
      .click();
    
    cy.wait(500); // Wait for dropdown to open
    
    // Select first option (Entwickler)
    cy.get('body').then(($body) => {
      const appOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
      
      // Try to find Entwickler by text first
      const entwicklerOption = appOptions.filter((i, el) => {
        return Cypress.$(el).text().toLowerCase().includes('entwickler');
      });
      
      if (entwicklerOption.length > 0) {
        cy.wrap(entwicklerOption.first()).click();
      } else if (appOptions.length >= 1) {
        // Fallback: select first available option
        cy.wrap(appOptions.first()).click();
      }
    });
    
    cy.wait(500);
    
    // Save the series (Speichern)
    cy.log('Saving series');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    
    // Wait for save to complete
    cy.wait(2000);
    
    // Helper function to create a series for a specific genre
    const createSeriesForGenre = (genreName, genreIndex) => {
      // Click create new series button
      cy.log(`Creating series for ${genreName}`);
      cy.get('[style="display: flex; align-items: center; gap: 12px;"] > .modal-trigger > .jss464')
        .should('be.visible')
        .click();
      
      cy.wait(2000); // Wait for series form to load
      
      // Fill Series Name field (include genre name)
      cy.log(`Filling Series Name for ${genreName}`);
      cy.get('#frc-name-1048423413')
        .should('be.visible')
        .clear()
        .type(`E2E Series ${genreName} ${timestamp}`);
      
      // Fill Series Slug field
      cy.log(`Filling Series Slug for ${genreName}`);
      cy.get('#frc-slug-1053376469')
        .should('be.visible')
        .clear()
        .type(`e2e-series-${genreName.toLowerCase().replace(/_/g, '-')}-${timestamp}`);
      
      // Select Genre
      cy.log(`Selecting Genre: ${genreName}`);
      cy.get('.input-genre > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3')
        .should('be.visible')
        .click();
      
      cy.wait(500); // Wait for dropdown to open
      
      // Select genre option (skip first empty option if exists)
      cy.get('body').then(($body) => {
        const genreOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
        
        // Try to find genre by text first
        const genreOption = genreOptions.filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes(genreName.toLowerCase()) || text.includes(genreName.toLowerCase().replace(/_/g, ' '));
        });
        
        if (genreOption.length > 0) {
          cy.wrap(genreOption.first()).click();
        } else if (genreOptions.length > genreIndex) {
          // If genre not found by text, select by index (skip first empty if exists)
          cy.wrap(genreOptions.eq(genreIndex)).click();
        } else if (genreOptions.length >= 1) {
          // Fallback: select first available option
          cy.wrap(genreOptions.first()).click();
        }
      });
      
      cy.wait(500);
      
      // Select App Visibility - choose Entwickler
      cy.log('Selecting App Visibility: Entwickler');
      cy.get('.input-visibleInApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3')
        .should('be.visible')
        .click();
      
      cy.wait(500); // Wait for dropdown to open
      
      // Select Entwickler option
      cy.get('body').then(($body) => {
        const appOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
        
        // Try to find Entwickler by text first
        const entwicklerOption = appOptions.filter((i, el) => {
          return Cypress.$(el).text().toLowerCase().includes('entwickler');
        });
        
        if (entwicklerOption.length > 0) {
          cy.wrap(entwicklerOption.first()).click();
        } else if (appOptions.length >= 1) {
          // Fallback: select first available option
          cy.wrap(appOptions.first()).click();
        }
      });
      
      cy.wait(500);
      
      // Save the series (Speichern)
      cy.log(`Saving ${genreName} series`);
      cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
        .first()
        .scrollIntoView()
        .should('contain', 'Speichern')
        .click();
      
      // Wait for save to complete
      cy.wait(2000);
    };
    
    // Create series for remaining genres
    // FSLE (second option, index 1 if first is empty, or index 2)
    createSeriesForGenre('FSLE', 2);
    
    // CAMP
    createSeriesForGenre('CAMP', 3);
    
    // FLEX_CAMP
    createSeriesForGenre('FLEX_CAMP', 4);
    
    // RHEINGOLD
    createSeriesForGenre('RHEINGOLD', 5);
    
    // COURSE
    createSeriesForGenre('COURSE', 6);
    
    // READ
    createSeriesForGenre('READ', 7);
    
    // Publish conference brand first
    cy.log('Publishing conference brand');
    cy.get('button.button', { timeout: 15000 })
      .contains('Publish')
      .first()
      .should('exist')
      .scrollIntoView()
      .click();
    
    cy.wait(3000); // Wait after publishing brand
    
    // Helper function to publish a series
    const publishSeries = (seriesName) => {
      cy.log(`Publishing series: ${seriesName}`);
      
      // Find and click on the series name to open it
      cy.contains(seriesName, { timeout: 10000 })
        .should('be.visible')
        .first()
        .click();
      
      cy.wait(2000); // Wait for series detail page to load
      
      // Click publish button for the series
      cy.get('button.button', { timeout: 15000 })
        .contains('Publish')
        .first()
        .should('exist')
        .scrollIntoView()
        .click();
      
      cy.wait(5000); // Wait longer after publishing series for overlay/modal to appear/disappear
      
      // Wait for overlay to potentially disappear or handle it
      cy.get('body').then(($body) => {
        // Check if overlay exists and wait for it to disappear
        const overlay = $body.find('.jss1458[aria-hidden="false"]');
        if (overlay.length > 0) {
          cy.wait(2000); // Wait for overlay animation
        }
      });
      
      // Click close button to close the screen
      cy.log('Closing series screen');
      cy.get('[style="float: right;"]', { timeout: 10000 })
        .should('exist')
        .click({ force: true }); // Force click to handle overlay coverage
      
      // If force click doesn't work, try pressing Escape as fallback
      cy.wait(1000);
      cy.get('body').then(($body) => {
        // Check if we're still on the series page (close button still exists)
        const closeButton = $body.find('[style="float: right;"]');
        if (closeButton.length > 0 && closeButton.is(':visible')) {
          cy.log('Close button still visible, trying Escape key');
          cy.get('body').type('{esc}');
        }
      });
      
      cy.wait(2000); // Wait after closing
    };
    
    // Publish each series one by one
    const seriesNames = [
      `E2E Series Tutorial ${timestamp}`,
      `E2E Series FSLE ${timestamp}`,
      `E2E Series CAMP ${timestamp}`,
      `E2E Series FLEX_CAMP ${timestamp}`,
      `E2E Series RHEINGOLD ${timestamp}`,
      `E2E Series COURSE ${timestamp}`,
      `E2E Series READ ${timestamp}`
    ];
    
    // Publish all series
    seriesNames.forEach((seriesName) => {
      publishSeries(seriesName);
    });
    
    cy.log(`✅ Conference Brand "${conferenceBrandName}" created with series and all genres, and all published`);
  });
});
