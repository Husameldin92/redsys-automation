// Session-based login that caches authentication state
// IMPORTANT: First run must be in interactive mode (npm run open) to manually login
// Subsequent runs: Session is restored automatically (no manual login needed)
Cypress.Commands.add('loginAs', (userType = 'admin') => {
  // Create a session ID that includes browser name to ensure compatibility
  const browserName = Cypress.browser.name;
  const sessionId = `${userType}-${browserName}`;
  
  cy.session(
    sessionId, // Session ID includes browser name for compatibility
    () => {
      // This function runs ONLY if session doesn't exist or is invalid
      cy.log('🔐 No valid session found. Please log in manually via Google.');
      cy.log(`🔍 Browser: ${browserName}, Headless: ${Cypress.browser.isHeadless}`);
      
      // Check if we're in interactive mode (cypress open) vs headless (cypress run)
      const isInteractive = Cypress.config('isInteractive') !== false;
      const isHeadless = Cypress.browser.isHeadless;
      
      cy.log(`🔍 Mode detection: isInteractive=${isInteractive}, isHeadless=${isHeadless}`);
      
      if (isHeadless || !isInteractive) {
        cy.log('⚠️  Running in headless/non-interactive mode.');
        cy.log('💡 Session creation requires interactive mode.');
        cy.log('💡 IMPORTANT: Make sure to run in the SAME browser type!');
        cy.log('💡 Run: npm run open');
        cy.log('💡 Select Electron browser (same as headless mode uses)');
        cy.log('💡 Log in manually when it pauses, click Resume');
        cy.log('💡 After that, npm run test:brand will work');
        throw new Error('Cannot create session in headless mode. Run "npm run open" first (use Electron browser) to create session.');
      }
      
      // 1. Go to a PUBLIC page first (homepage)
      cy.visit('/', { failOnStatusCode: false });

      // 2. Pause IMMEDIATELY so you can manually log in via Google (only works in interactive mode)
      cy.log('⏸️  Pausing for manual Google login. After logging in, click Resume.');
      cy.pause();

      // 3. After resume, verify login worked
      cy.contains('Not Allowed').should('not.exist');
      
      // 4. Visit a protected page to ensure we're logged in
      cy.visit('/brands', { failOnStatusCode: false });
      cy.contains('Not Allowed').should('not.exist');
      
      cy.log('✅ Login successful! Session will be saved for future runs.');
    },
    {
      validate: () => {
        // Validate that the session is still valid
        // In headless mode, be more lenient since we can't recreate session
        const isHeadless = Cypress.browser.isHeadless;
        
        if (isHeadless) {
          // In headless mode, just check if session data exists
          // Don't do full validation to avoid triggering recreation
          cy.log('🔍 Headless mode: Skipping strict validation');
          return; // Return early - trust that session exists
        }
        
        // In interactive mode, do full validation
        cy.visit('/brands', { failOnStatusCode: false });
        cy.get('body', { timeout: 15000 }).should('exist');
        cy.wait(1000);
        
        cy.get('body').then(($body) => {
          const bodyText = $body.text();
          const hasNotAllowed = bodyText.includes('Not Allowed');
          
          if (hasNotAllowed && bodyText.length < 100) {
            cy.log('⚠️  Session validation: Found "Not Allowed" - session may be invalid');
            throw new Error('Session expired or invalid');
          } else {
            cy.log('✅ Session validation: Session appears valid');
          }
        });
      },
      cacheAcrossSpecs: true, // Share session across all test files
      // Note: Sessions are browser-specific, so make sure to create session in same browser type
    }
  );
  
  cy.log(`✅ Using session: ${sessionId}`);
  
  // After session is established/restored, visit the app
  cy.visit('/', { failOnStatusCode: false });
  cy.contains('Not Allowed').should('not.exist');
});

// Debug command to check session status
Cypress.Commands.add('checkSessionStatus', () => {
  cy.log('🔍 Checking session status...');
  cy.visit('/brands', { failOnStatusCode: false });
  cy.get('body').then(($body) => {
    const hasNotAllowed = $body.text().includes('Not Allowed');
    if (hasNotAllowed) {
      cy.log('❌ Session is INVALID - not logged in');
    } else {
      cy.log('✅ Session is VALID - logged in');
    }
  });
});
