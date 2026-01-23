describe('Brand Creation and Management', () => {
  // Generate unique identifier for test data
  const timestamp = Date.now();
  const brandName = `E2E Brand ${timestamp}`;
  
  before(() => {
    // Login once before all tests
    cy.loginAs('admin');
  });
  
  it('should create a new brand and then edit it to upload images', () => {
    // Step 1: Create Brand
    cy.log('Creating Brand');
    cy.visit('/brands');
    cy.contains('Not Allowed').should('not.exist');
    
    // Click create button
    cy.get('a[href="#"]')
      .contains('Create new Magazine')
      .should('be.visible')
      .click();
    
    // Fill basic brand information
    cy.get('#frc-name--1782415253').type(brandName);
    cy.get('#frc-slug--1317495733').type(brandName.toLowerCase().replace(/ /g, '-'));
    cy.get('#frc-price-1858698673').type('100');
    cy.get('#frc-size--483674448').type('100');
    
    // Select Apps dropdown
    cy.selectReactSelectOption('.drop-down .css-bg1rzq-control', ['entwickler.de', 'devmio'], 2);
    
    // Fill additional fields
    cy.get('#frc-introText--918969944').type('This is a test introduction');
    cy.get('#frc-publicationFrequency-1046486578').type('100');
    
    // Select Language dropdown
    cy.selectReactSelectOptionByRole('.input-language > .jss278 > .jss294 > .jss326 > .jss327', ['English', 'German']);
    
    // Fill color
    cy.get('#frc-colour-1601995274').type('#000000');
    
    // Select Conference Series dropdown
    cy.selectReactSelectOption('.input-conferenceSeriesId .css-bg1rzq-control', null);
    
    cy.wait(1000);
    
    // Save the brand form
    cy.get('button[type="submit"], button:contains("Save"), button:contains("Create"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .click();
    
    // Wait for success message or redirect
    cy.wait(2000);
    
    // Step 2: Navigate back to brands page and find the created brand
    cy.log('Finding created brand to edit');
    cy.visit('/brands');
    cy.wait(2000);
    
    // Ensure we're still logged in
    cy.contains('Not Allowed').should('not.exist');
    
    // Find and click on the created brand (ensure only one element)
    cy.contains(brandName, { timeout: 10000 })
      .should('be.visible')
      .first()
      .click();
    
    // Wait for brand detail page to load
    cy.wait(2000);
    
    // Click Edit button to enter edit mode
    cy.log('Clicking Edit button');
    cy.get(':nth-child(17) > .modal-trigger > .jss314')
      .first()
      .should('be.visible')
      .click();
    
    // Wait for edit form to load
    cy.wait(2000);
    
    // Step 3: Upload brand images (after creation, in edit mode)
    cy.log('Uploading brand images');
    cy.uploadImageByType('brand-logo-upload', 'brandLogo'); // LOGO
    cy.uploadImageByType('brand-transparent-logo-upload', 'brandTransparentLogo'); // Transparent Logo
    cy.uploadImageByType('brand-header-upload', 'brandHeader'); // Header
    cy.uploadImageByType('brand-issue-background-upload', 'brandIssueBackground'); // Issue background images
    cy.uploadImageByType('brand-article-overlay-upload', 'brandArticleOverlay'); // Article Overlay Image
    cy.uploadImageByType('brand-generic-teaser-upload', 'brandGenericTeaser'); // Generic Teaser Image (2048 x 848)
    
    // Save changes
    cy.get('button[type="submit"], button:contains("Save"), [data-testid*="save"]')
      .first()
      .click();
    
    // Wait for save to complete
    cy.wait(2000);
    
    // Verify success
    cy.get('[data-testid="toast-success"], .success-message', { timeout: 10000 })
      .should('be.visible');
  });
  
  it('should verify brand exists in list', () => {
    cy.visit('/brands');
    cy.wait(2000);
    cy.get('body').should('be.visible');
    cy.contains(brandName, { timeout: 10000 })
      .should('exist')
      .should('be.visible');
  });
});
