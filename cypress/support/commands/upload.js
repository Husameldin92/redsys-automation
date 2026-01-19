// File upload command using data-testid
Cypress.Commands.add('uploadByTestId', (testId, filePath) => {
  cy.get(`[data-testid="${testId}"]`).selectFile(filePath, { force: true });
  
  // Optional: Wait for upload to complete
  // You might need to adjust this based on your app's behavior
  cy.wait(500); // Small wait to ensure file is processed
  
  // Optional: Assert that file was selected (if your app shows filename)
  // cy.get(`[data-testid="${testId}-filename"]`).should('contain', filePath.split('/').pop());
});
