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
