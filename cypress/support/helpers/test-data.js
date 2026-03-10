// Helper functions for sharing test data between test files

/**
 * Store the last created brand name for use in other tests
 * @param {string} brandName - Name of the brand that was just created
 */
Cypress.Commands.add('storeLastCreatedBrand', (brandName) => {
  const data = {
    brandName: brandName,
    timestamp: Date.now()
  };
  
  cy.writeFile('cypress/fixtures/last-created-brand.json', data);
  cy.log(`✅ Stored last created brand: ${brandName}`);
});

/**
 * Get the last created brand name from test data
 * @returns {Cypress.Chainable<string>} The brand name
 */
Cypress.Commands.add('getLastCreatedBrand', () => {
  return cy.readFile('cypress/fixtures/last-created-brand.json').then((data) => {
    cy.log(`📖 Retrieved last created brand: ${data.brandName}`);
    return cy.wrap(data.brandName);
  });
});

/**
 * Store the last created author name for use in other tests
 * @param {string} authorName - Name of the author that was just created
 */
Cypress.Commands.add('storeLastCreatedAuthor', (authorName) => {
  const data = {
    authorName: authorName,
    timestamp: Date.now()
  };
  
  cy.writeFile('cypress/fixtures/last-created-author.json', data);
  cy.log(`✅ Stored last created author: ${authorName}`);
});

/**
 * Get the last created author name from test data
 * @returns {Cypress.Chainable<string>} The author name
 */
Cypress.Commands.add('getLastCreatedAuthor', () => {
  return cy.readFile('cypress/fixtures/last-created-author.json').then((data) => {
    cy.log(`📖 Retrieved last created author: ${data.authorName}`);
    return cy.wrap(data.authorName);
  });
});

/**
 * Store the last created conference brand name for use in other tests
 * @param {string} conferenceBrandName - Name of the conference brand that was just created
 * @param {number} seriesTimestamp - Timestamp used when creating series (for E2E Series Tutorial/FSLE/etc names)
 */
Cypress.Commands.add('storeLastCreatedConferenceBrand', (conferenceBrandName, seriesTimestamp) => {
  const data = {
    conferenceBrandName: conferenceBrandName,
    timestamp: Date.now(),
    seriesTimestamp: seriesTimestamp != null ? seriesTimestamp : Date.now()
  };
  
  cy.writeFile('cypress/fixtures/last-created-conference-brand.json', data);
  cy.log(`✅ Stored last created conference brand: ${conferenceBrandName}`);
});

/**
 * Get the last created conference brand name from test data
 * @returns {Cypress.Chainable<string>} The conference brand name
 */
Cypress.Commands.add('getLastCreatedConferenceBrand', () => {
  return cy.readFile('cypress/fixtures/last-created-conference-brand.json').then((data) => {
    cy.log(`📖 Retrieved last created conference brand: ${data.conferenceBrandName}`);
    return cy.wrap(data.conferenceBrandName);
  });
});

/**
 * Get the series name for a genre from the last created conference brand
 * Each genre (Tutorial, FSLE, CAMP, etc.) has its own series in that brand
 * @param {string} genre - Genre name (e.g. 'Tutorial', 'FSLE', 'CAMP', 'FLEX_CAMP', 'RHEINGOLD', 'COURSE', 'READ')
 * @returns {Cypress.Chainable<string>} The series name (e.g. 'E2E Series Tutorial 123')
 */
Cypress.Commands.add('getLastCreatedConferenceBrandSeries', (genre) => {
  return cy.readFile('cypress/fixtures/last-created-conference-brand.json').then((data) => {
    let ts = data.seriesTimestamp || data.timestamp;
    if (!ts && data.conferenceBrandName) {
      const match = data.conferenceBrandName.match(/(\d+)$/);
      if (match) ts = match[1];
    }
    const seriesName = `E2E Series ${genre} ${ts}`;
    cy.log(`📖 Retrieved ${genre} series from last conference brand: ${seriesName}`);
    return cy.wrap(seriesName);
  });
});

/**
 * Store the last created tutorial name for use in other tests
 * @param {string} tutorialName - Name of the tutorial that was just created
 */
Cypress.Commands.add('storeLastCreatedTutorial', (tutorialName) => {
  const data = {
    tutorialName: tutorialName,
    timestamp: Date.now()
  };
  
  cy.writeFile('cypress/fixtures/last-created-tutorial.json', data);
  cy.log(`✅ Stored last created tutorial: ${tutorialName}`);
});

/**
 * Get the last created tutorial name from test data
 * @returns {Cypress.Chainable<string>} The tutorial name
 */
Cypress.Commands.add('getLastCreatedTutorial', () => {
  return cy.readFile('cypress/fixtures/last-created-tutorial.json').then((data) => {
    cy.log(`📖 Retrieved last created tutorial: ${data.tutorialName}`);
    return cy.wrap(data.tutorialName);
  });
});

/**
 * Store the last created FSLE name for use in other tests
 * @param {string} fsleName - Name of the FSLE that was just created
 */
Cypress.Commands.add('storeLastCreatedFSLE', (fsleName) => {
  const data = {
    fsleName: fsleName,
    timestamp: Date.now()
  };
  
  cy.writeFile('cypress/fixtures/last-created-fsle.json', data);
  cy.log(`✅ Stored last created FSLE: ${fsleName}`);
});

/**
 * Get the last created FSLE name from test data
 * @returns {Cypress.Chainable<string>} The FSLE name
 */
Cypress.Commands.add('getLastCreatedFSLE', () => {
  return cy.readFile('cypress/fixtures/last-created-fsle.json').then((data) => {
    cy.log(`📖 Retrieved last created FSLE: ${data.fsleName}`);
    return cy.wrap(data.fsleName);
  });
});
