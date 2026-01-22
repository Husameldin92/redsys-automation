// Manual Google login gate (safe version)
Cypress.Commands.add('loginAs', () => {

  // 1. Go to a PUBLIC page first (homepage)
  cy.visit('/', { failOnStatusCode: false });

  // 2. Pause IMMEDIATELY so you can click
  cy.log('Please log in manually via Google, then click Resume.');
  cy.pause();

  // 3. After resume, verify login worked
  cy.contains('Not Allowed').should('not.exist');

  // 4. Now go to protected area
  cy.visit('/brands', { failOnStatusCode: false });
});
