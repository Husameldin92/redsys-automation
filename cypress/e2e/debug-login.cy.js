describe('Debug Login Flow', () => {
  it('should capture login form elements for debugging', () => {
    // Visit the site
    cy.visit('/');
    cy.wait(3000);
    
    // Take a screenshot of initial page
    cy.screenshot('01-initial-page');
    
    // Check what login buttons are actually available
    cy.get('body').then($body => {
      // Log the page text to see what's there
      cy.log('Page contains S&S ANMELDUNG:', $body.text().includes('S&S ANMELDUNG'));
      cy.log('Page contains ANMELDUNG:', $body.text().includes('ANMELDUNG'));
      cy.log('Page contains Login:', $body.text().includes('Login'));
      
      // Find all elements that might be login buttons
      const possibleLoginSelectors = [
        '.AccountsSocialButtons-root-91 > .jss61 > .MuiButton-label-36',
        'button:contains("S&S ANMELDUNG")',
        'button:contains("ANMELDUNG")',
        'button:contains("Login")',
        'button:contains("Anmelden")',
        '[data-testid*="login"]',
        '[data-testid*="auth"]'
      ];
      
      possibleLoginSelectors.forEach(selector => {
        const found = $body.find(selector);
        if (found.length > 0) {
          cy.log(`Found login element with selector: ${selector}`);
          cy.log(`Element text: ${found.text()}`);
          cy.log(`Element visible: ${found.is(':visible')}`);
        }
      });
    });
    
    // Try different approaches to find the login button
    cy.get('body').then($body => {
      if ($body.find('.AccountsSocialButtons-root-91').length > 0) {
        cy.log('Found AccountsSocialButtons container');
        cy.get('.AccountsSocialButtons-root-91').click({ force: true });
      } else if ($body.text().includes('S&S ANMELDUNG')) {
        cy.log('Found S&S ANMELDUNG text, trying to click it');
        cy.contains('S&S ANMELDUNG').click({ force: true });
      } else if ($body.text().includes('ANMELDUNG')) {
        cy.log('Found ANMELDUNG text, trying to click it');
        cy.contains('ANMELDUNG').click({ force: true });
      } else {
        cy.log('No login button found, trying any button');
        cy.get('button').first().click({ force: true });
      }
    });
    
    // Wait and take screenshot after clicking
    cy.wait(5000);
    cy.screenshot('02-after-login-attempt');
    
    // Check if anything changed
    cy.get('body').then($body => {
      cy.log('After click - Page contains Google:', $body.text().includes('Google'));
      cy.log('After click - Page contains Anmeldung:', $body.text().includes('Anmeldung'));
      cy.log('After click - Input count:', $body.find('input').length);
      cy.log('After click - Button count:', $body.find('button').length);
    });
  });
});
