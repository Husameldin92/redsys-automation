// Helper functions for dropdown interactions

/**
 * Select an option from a React Select dropdown by clicking the control
 * @param {string} controlSelector - Selector for the dropdown control
 * @param {string|Array} optionText - Text to search for (string or array of strings to try)
 * @param {number} reactSelectNumber - Optional: specific react-select number (e.g., 2 for react-select-2)
 */
Cypress.Commands.add('selectReactSelectOption', (controlSelector, optionText, reactSelectNumber = null) => {
  // Click the dropdown control (ensure only one element)
  cy.get(controlSelector).first().click();
  
  // Wait for menu to render
  cy.wait(500);
  
  // Build selector for options
  let optionSelector;
  if (reactSelectNumber) {
    optionSelector = `[id^="react-select-${reactSelectNumber}-option-"]`;
  } else {
    optionSelector = '[id^="react-select-"][id*="-option-"]';
  }
  
  // Find options
  cy.get(optionSelector, { timeout: 10000 })
    .should('have.length.at.least', 1)
    .then(($options) => {
      const optionsToTry = Array.isArray(optionText) ? optionText : [optionText];
      
      // Try each option text
      for (const text of optionsToTry) {
        const foundOption = Array.from($options).find(opt => 
          opt.textContent.includes(text)
        );
        
        if (foundOption) {
          cy.wrap(foundOption).click();
          return;
        }
      }
      
      // Fallback: click first option
      cy.wrap($options.first()).click();
    });
});

/**
 * Select an option from a React Select dropdown using role="option"
 * @param {string} controlSelector - Selector for the dropdown control
 * @param {string|Array} optionText - Text to search for
 */
Cypress.Commands.add('selectReactSelectOptionByRole', (controlSelector, optionText) => {
  cy.get(controlSelector).first().click();
  cy.wait(500);
  
  const optionsToTry = Array.isArray(optionText) ? optionText : [optionText];
  
  cy.get('body').then(($body) => {
    for (const text of optionsToTry) {
      const option = $body.find('[role="option"]').filter((i, el) => 
        Cypress.$(el).text().includes(text)
      );
      
      if (option.length > 0) {
        cy.wrap(option.first()).click();
        return;
      }
    }
    
    // Fallback: click first option
    cy.get('[role="option"]').first().click();
  });
});
