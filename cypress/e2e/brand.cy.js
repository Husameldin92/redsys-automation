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
    
    // Fill slogan field
    cy.get('#frc-slogan--66047816').type('test slogan');
    
    // Step 3: Upload brand images (after creation, in edit mode)
    cy.log('Uploading brand images');
    
    // Helper function to upload to dropzone
    const uploadToDropzone = (containerSelector, imagePath) => {
      // Find the file input within the container, or click dropzone first to activate it
      cy.get(containerSelector).within(() => {
        cy.get('input[type="file"]').selectFile(imagePath, { force: true });
      });
      cy.wait(500);
    };
    
    // Upload logo
    uploadToDropzone('.input-logo', 'cypress/fixtures/images/brand-logo.png');
    
    // Upload transparent logo
    uploadToDropzone('.input-transparentLogo', 'cypress/fixtures/images/brand-transparent-logo.svg');
    
    // Upload header
    uploadToDropzone('.input-header', 'cypress/fixtures/images/brand-header.png');
    
    // Upload issue background
    uploadToDropzone('.input-deepLinkIssueBackgroundImage', 'cypress/fixtures/images/brand-issue-background.png');
    
    // Upload article overlay
    uploadToDropzone('.input-deepLinkArticleOverlayImage', 'cypress/fixtures/images/brand-article-overlay.png');
    
    // Upload teaser - scroll into view first, then upload
    cy.get('.input-teaserImage')
      .scrollIntoView()
      .within(() => {
        cy.get('input[type="file"]').selectFile('cypress/fixtures/images/brand-generic-teaser.jpg', { force: true });
      });
    cy.wait(1000); // Wait a bit longer for teaser upload
    
    // Save changes - click "Speichern" button
    // Scroll to button first (same pattern as creation save)
    cy.get('button.submit-button[type="submit"]')
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    
    // Wait for save to complete and check we're still logged in
    cy.wait(2000);
    
    // Verify we're still logged in - check URL and page content
    cy.url().should('not.include', '/login');
    cy.url().should('not.include', '/auth');
    cy.get('body').should('not.contain', 'Not Allowed');
    
    // Test complete - brand created and edited successfully, still logged in
  });
});
