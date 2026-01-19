// Authentication command
Cypress.Commands.add('loginAs', (userType = 'admin') => {
  // Visit the main page
  cy.visit('/');
  
  // Wait for the page to fully load
  cy.url().should('contain', 'redsys-stage.sandsmedia.com');
  cy.wait(2000);
  
  // First, click the "S&S ANMELDUNG" (login) button to open the login form
  // Use the original working selector with force: true to bypass visibility issues
  cy.get('.AccountsSocialButtons-root-91 > .jss61 > .MuiButton-label-36', { timeout: 10000 })
    .click({ force: true });
  
  // Wait for login form to appear and debug what's on the page
  cy.wait(3000); // Longer wait for Google OAuth to load
  
  // Wait for Google login overlay to appear
  cy.contains('Über Google anmelden').should('be.visible');
  
  // Step 1: Enter email in Google login form
  // The Google form appears as an overlay, not a redirect, so we stay on the same domain
  // Wait for the Google login form to appear
  cy.wait(2000);
  
  // Look for the email input field in the Google login overlay
  cy.get('input[type="email"], #identifierId, input[name="identifier"], input[placeholder*="E-Mail"]')
    .should('be.visible')
    .click()
    .clear()
    .type(Cypress.env('ADMIN_USERNAME') || 'hosman@sandsmedia.com');
  
  // Step 2: Click "Weiter" button
  cy.wait(1000);
  
  // Click the "Weiter" button to proceed to password step
  cy.contains('button', 'Weiter').should('be.visible').click();
  
  // Wait for password field to appear
  cy.wait(3000);
  
  // Step 3: Enter password in Google login form
  // Find and fill the password input field
  cy.get('input[type="password"], input[name="Passwd"], input[name="password"]')
    .should('be.visible')
    .click()
    .clear()
    .type(Cypress.env('ADMIN_PASSWORD') || 'Hossamaccent2015+');
  
  // Step 4: Click final login/submit button
  cy.wait(1000);
  
  // Click the final login button (might be "Weiter", "Anmelden", or similar)
  cy.get('button[type="submit"], button:contains("Weiter"), button:contains("Anmelden"), button:contains("Next")')
    .should('be.visible')
    .click();
  
  // Wait for successful login - multiple strategies
  // Strategy 1: Wait for a small delay to ensure login processes
  cy.wait(2000);
  
  // Strategy 2: Wait for any indication of logged-in state
  // Update these selectors based on what appears after login in your app
  cy.get('body').then($body => {
    // Try multiple possible post-login indicators
    const possibleSelectors = [
      '[data-testid="user-menu"]',
      '[data-testid="dashboard"]',
      '[data-testid="main-nav"]',
      '.user-menu',
      '.dashboard',
      'nav'
    ];
    
    // Find the first existing element
    for (const selector of possibleSelectors) {
      if ($body.find(selector).length > 0) {
        cy.get(selector).should('be.visible');
        break;
      }
    }
  });
  
  // Alternative Option 2: Using localStorage/sessionStorage (if your app supports it)
  // This is faster but requires knowing the auth token structure
  /*
  const authToken = Cypress.env('AUTH_TOKEN') || 'mock-auth-token';
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', authToken);
    win.localStorage.setItem('userRole', userType);
  });
  
  // Or using cookies if that's how your app handles auth
  cy.setCookie('auth-token', authToken);
  cy.setCookie('user-role', userType);
  
  // Visit the app after setting auth
  cy.visit('/');
  */
});
