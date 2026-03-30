describe('Full Flow: Conference Brand → Tutorial → FSLE → Camps → Flex Camps', () => {
  const timestamp = Date.now();
  const conferenceBrandName = `E2E Conference Brand ${timestamp}`;
  const seriesName = `E2E Series Tutorial ${timestamp}`;
  const tutorialName = `E2E Tutorial ${timestamp}`;
  const fsleName = `E2E FSLE ${timestamp}`;
  const campsName = `E2E Camps ${timestamp}`;
  const flexCampsName = `E2E Flex Camps ${timestamp}`;

  before(() => {
    cy.loginAs('admin');
  });

  it('Step 1: Create conference brand with series and publish all', () => {
    cy.log('=== STEP 1: Creating Conference Brand ===');
    cy.visit('/live_events?option=conferenceBrands');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);

    cy.get('a[href="#"]').contains('Create new Brand').should('be.visible').click();
    cy.wait(2000);

    cy.log('Filling Name');
    cy.get('#frc-name-1048423413').should('be.visible').clear().type(conferenceBrandName);

    cy.log('Filling Slug');
    cy.get('#frc-slug-1053376469').should('be.visible').clear().type(conferenceBrandName.toLowerCase().replace(/ /g, '-'));

    cy.log('Adding first topic rating');
    cy.get('.col-sm-9 > .jss32 > .jss82').should('be.visible').click();
    cy.wait(1000);

    cy.log('Selecting first topic');
    cy.get('.jss341').should('be.visible').click();
    cy.wait(500);

    cy.get('body').then(($body) => {
      const topicOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
      if (topicOptions.length >= 2) {
        cy.wrap(topicOptions.eq(1)).click();
      }
    });
    cy.wait(500);

    cy.log('Setting rating to 5');
    cy.get('#frc-rating-256768864').should('be.visible').clear().type('5');
    cy.wait(500);

    cy.log('Saving conference brand');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    cy.wait(2000);

    cy.storeLastCreatedConferenceBrand(conferenceBrandName, timestamp);

    cy.log('Clicking create new series button');
    cy.get('[style="display: flex; align-items: center; gap: 12px;"] > :nth-child(1)').should('be.visible').click();
    cy.wait(2000);

    cy.log('Filling Series Name');
    cy.get('#frc-name-1048423413').should('be.visible').clear().type(seriesName);

    cy.log('Filling Series Slug');
    cy.get('#frc-slug-1053376469').should('be.visible').clear().type(seriesName.toLowerCase().replace(/ /g, '-'));

    cy.log('Selecting Genre: Tutorial');
    cy.get('.input-genre > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3').should('be.visible').click();
    cy.wait(500);

    cy.get('body').then(($body) => {
      const genreOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
      const tutorialOption = genreOptions.filter((i, el) => Cypress.$(el).text().toLowerCase().includes('tutorial'));
      if (tutorialOption.length > 0) {
        cy.wrap(tutorialOption.first()).click();
      } else if (genreOptions.length >= 2) {
        cy.wrap(genreOptions.eq(1)).click();
      } else if (genreOptions.length >= 1) {
        cy.wrap(genreOptions.first()).click();
      }
    });
    cy.wait(500);

    cy.log('Selecting App Visibility: Entwickler');
    cy.get('.input-visibleInApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3').should('be.visible').click();
    cy.wait(500);

    cy.get('body').then(($body) => {
      const appOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
      const entwicklerOption = appOptions.filter((i, el) => Cypress.$(el).text().toLowerCase().includes('entwickler'));
      if (entwicklerOption.length > 0) {
        cy.wrap(entwicklerOption.first()).click();
      } else if (appOptions.length >= 1) {
        cy.wrap(appOptions.first()).click();
      }
    });
    cy.wait(500);

    cy.log('Saving series');
    cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
      .first()
      .scrollIntoView()
      .should('contain', 'Speichern')
      .click();
    cy.wait(2000);

    const createSeriesForGenre = (genreName, genreIndex) => {
      cy.log(`Creating series for ${genreName}`);
      cy.get('[style="display: flex; align-items: center; gap: 12px;"] > :nth-child(1)').should('be.visible').click();
      cy.wait(2000);

      cy.get('#frc-name-1048423413').should('be.visible').clear().type(`E2E Series ${genreName} ${timestamp}`);
      cy.get('#frc-slug-1053376469').should('be.visible').clear().type(`e2e-series-${genreName.toLowerCase().replace(/_/g, '-')}-${timestamp}`);

      cy.get('.input-genre > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3').should('be.visible').click();
      cy.wait(500);

      cy.get('body').then(($body) => {
        const genreOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
        const genreOption = genreOptions.filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes(genreName.toLowerCase()) || text.includes(genreName.toLowerCase().replace(/_/g, ' '));
        });
        if (genreOption.length > 0) {
          cy.wrap(genreOption.first()).click();
        } else if (genreOptions.length > genreIndex) {
          cy.wrap(genreOptions.eq(genreIndex)).click();
        } else if (genreOptions.length >= 1) {
          cy.wrap(genreOptions.first()).click();
        }
      });
      cy.wait(500);

      cy.get('.input-visibleInApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3').should('be.visible').click();
      cy.wait(500);

      cy.get('body').then(($body) => {
        const appOptions = $body.find('[role="option"], [id^="react-select-"][id*="-option-"]');
        const entwicklerOption = appOptions.filter((i, el) => Cypress.$(el).text().toLowerCase().includes('entwickler'));
        if (entwicklerOption.length > 0) {
          cy.wrap(entwicklerOption.first()).click();
        } else if (appOptions.length >= 1) {
          cy.wrap(appOptions.first()).click();
        }
      });
      cy.wait(500);

      cy.get('button.submit-button[type="submit"], button:contains("Save"), button:contains("Speichern"), [data-testid*="save"], [data-testid*="submit"]')
        .first()
        .scrollIntoView()
        .should('contain', 'Speichern')
        .click();
      cy.wait(2000);
    };

    createSeriesForGenre('FSLE', 2);
    createSeriesForGenre('CAMP', 3);
    createSeriesForGenre('FLEX_CAMP', 4);
    createSeriesForGenre('RHEINGOLD', 5);
    createSeriesForGenre('COURSE', 6);
    createSeriesForGenre('READ', 7);

    cy.log('Publishing conference brand');
    cy.get('button.button', { timeout: 15000 }).contains('Publish').first().should('exist').scrollIntoView().click();
    cy.wait(3000);

    const publishSeries = (name) => {
      cy.log(`Publishing series: ${name}`);
      cy.contains(name, { timeout: 10000 }).should('be.visible').first().click();
      cy.wait(2000);
      cy.get('button.button', { timeout: 15000 }).contains('Publish').first().should('exist').scrollIntoView().click();
      cy.wait(5000);
      cy.get('body').then(($body) => {
        const overlay = $body.find('.jss1458[aria-hidden="false"]');
        if (overlay.length > 0) cy.wait(2000);
      });
      cy.get('[style="float: right;"]', { timeout: 10000 }).should('exist').click({ force: true });
      cy.wait(1000);
      cy.get('body').then(($body) => {
        const closeButton = $body.find('[style="float: right;"]');
        if (closeButton.length > 0 && closeButton.is(':visible')) {
          cy.get('body').type('{esc}');
        }
      });
      cy.wait(2000);
    };

    ['E2E Series Tutorial', 'E2E Series FSLE', 'E2E Series CAMP', 'E2E Series FLEX_CAMP', 'E2E Series RHEINGOLD', 'E2E Series COURSE', 'E2E Series READ'].forEach((prefix) => {
      publishSeries(`${prefix} ${timestamp}`);
    });

    cy.log(`✅ Conference Brand "${conferenceBrandName}" created and all series published`);
  });

  it('Step 2: Create Tutorial with lesson and publish', () => {
    cy.log('=== STEP 2: Creating Tutorial ===');
    cy.loginAs('admin');

    cy.visit('/live_events?option=blockbusters');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);

    cy.log('Clicking NEW TUTORIAL button');
    cy.get('body').then(($body) => {
      const btn = $body.find('button:contains("NEW TUTORIAL"), a:contains("NEW TUTORIAL"), button:contains("New Tutorial"), a:contains("New Tutorial")')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('new') && text.includes('tutorial');
        });
      if (btn.length > 0) {
        cy.wrap(btn.first()).should('be.visible').click();
      } else {
        cy.get('button[type="button"], a[href*="tutorial"]').contains('NEW TUTORIAL', { matchCase: false }).click();
      }
    });

    cy.wait(5000);
    cy.get('input, textarea, select', { timeout: 15000 }).first().should('exist');
    cy.wait(2000);

    cy.scrollTo(0, 500);
    cy.wait(1000);

    cy.get('#frc-name--1782415253').scrollIntoView().should('be.visible').clear().type(tutorialName);
    cy.get('#frc-slogan--66047816').should('be.visible').clear().type(`E2E Tutorial Slogan ${timestamp}`);
    cy.get('#frc-description--837447522').should('be.visible').clear().type(`This is a test description for E2E Tutorial ${timestamp}`);

    cy.selectReactSelectOption('.input-courseAccessType > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', 'FS');
    cy.selectReactSelectOption('.input-supportedApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', null);

    cy.getLastCreatedConferenceBrand().then((brandName) => {
      cy.wait(1000);
      cy.selectReactSelectOption('.css-1szy77t-control > .css-1hwfws3', brandName);
    });

    cy.getLastCreatedConferenceBrandSeries('Tutorial').then((seriesName) => {
      cy.selectReactSelectOption(':nth-child(4) > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', seriesName);
    });

    cy.scrollTo(0, 600);
    cy.wait(1000);

    cy.get('#frc-slug-1053376469').should('be.visible').clear().type(tutorialName.toLowerCase().replace(/ /g, '-'));

    cy.get('body').then(($body) => {
      const colourField = $body.find('input[id*="colour"], input[id*="color"]').not('#frc-slug-1053376469').not('#frc-headlineColourHexCode-616139814').first();
      if (colourField.length > 0) cy.wrap(colourField).clear().type('#000000');
    });
    cy.get('#frc-headlineColourHexCode-616139814').should('be.visible').clear().type('#000000');
    cy.wait(500);

    cy.get('button.submit-button[type="submit"], button:contains("Speichern")').first().scrollIntoView().should('contain', 'Speichern').click();
    cy.wait(2000);

    cy.storeLastCreatedTutorial(tutorialName);

    cy.contains(tutorialName, { timeout: 10000 }).should('be.visible').first().click();
    cy.wait(2000);

    cy.get('[style="margin-top: 2%; margin-left: 0.5%; margin-right: 0.5%;"] > :nth-child(1) > :nth-child(2) > .jss7').should('be.visible').click();
    cy.wait(2000);

    cy.get('.modal-trigger > .jss32 > .jss7').should('be.visible').click();
    cy.wait(3000);

    cy.get('body').then(($body) => {
      const nameField = $body.find('input[id*="name"], input[name*="name"]').not('[type="hidden"]').first();
      if (nameField.length > 0) {
        cy.wrap(nameField).scrollIntoView().should('be.visible').clear().type(`E2E Lesson ${timestamp}`);
      } else {
        cy.get('input[type="text"]').first().clear().type(`E2E Lesson ${timestamp}`);
      }
    });

    cy.get('#frc-description--837447522').scrollIntoView().should('be.visible').clear().type(`This is a test description for E2E Lesson ${timestamp}`);

    cy.get('.input-language > .jss479 > .jss522 > .jss552 > .jss553, .input-language > .jss347 > .jss390 > .jss420 > .jss421').first().should('be.visible').scrollIntoView().click();
    cy.wait(1000);
    cy.get('body').then(($body) => {
      const opts = $body.find('[role="option"]');
      const english = opts.filter((i, el) => Cypress.$(el).text().toLowerCase().includes('english'));
      if (english.length > 0) cy.wrap(english.first()).click();
      else if (opts.length >= 2) cy.wrap(opts.eq(1)).click();
      else cy.wrap(opts.first()).click();
    });

    cy.get('.input-startDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control').should('be.visible').scrollIntoView().click();
    cy.wait(500);
    cy.get('body').then(($body) => {
      const today = $body.find('.rdtDay.rdtToday');
      if (today.length > 0) cy.wrap(today.first()).click();
      else cy.get('.rdtDay:not(.rdtOld)').first().click();
    });
    cy.wait(1000);

    cy.get('.input-videoType [role="combobox"], .input-videoType [role="button"], .input-videoType .MuiSelect-select, .input-videoType > div > div').first().scrollIntoView().click();
    cy.wait(500);
    cy.get('[role="option"]').filter((i, el) => Cypress.$(el).text().includes('NONE')).first().click();

    cy.get('button.submit-button[type="submit"], button:contains("Speichern")').first().scrollIntoView().should('contain', 'Speichern').click();
    cy.wait(2000);

    cy.get('[style="margin-top:2%;margin-left:.5%;margin-right:.5%"] > :nth-child(1) > :nth-child(1) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);
    cy.get(':nth-child(4) > :nth-child(1) > .jss7').should('exist').click({ force: true });
    cy.wait(3000);
    cy.get(':nth-child(4) > :nth-child(1) > .jss7').should('exist').click({ force: true });
    cy.wait(2000);

    cy.log(`✅ Tutorial "${tutorialName}" created and published`);
  });

  it('Step 3: Create FSLE with lesson and publish', () => {
    cy.log('=== STEP 3: Creating FSLE ===');
    cy.loginAs('admin');

    cy.visit('/live_events?option=blockbusters');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);

    cy.get('.subMenu > :nth-child(3) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);

    cy.get('body').then(($body) => {
      const btn = $body.find('button:contains("NEW FSLE"), a:contains("NEW FSLE")')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('new') && (text.includes('fsle') || text.includes('fs le'));
        });
      if (btn.length > 0) cy.wrap(btn.first()).should('be.visible').click();
      else cy.get('button[type="button"], a[href*="fsle"]').contains('NEW FSLE', { matchCase: false }).click();
    });

    cy.wait(5000);
    cy.get('input, textarea, select', { timeout: 15000 }).first().should('exist');
    cy.wait(2000);

    cy.scrollTo(0, 500);
    cy.wait(1000);

    cy.get('#frc-name--1782415253').scrollIntoView().should('be.visible').clear().type(fsleName);
    cy.get('#frc-slogan--66047816').should('be.visible').clear().type(`E2E FSLE Slogan ${timestamp}`);
    cy.get('#frc-description--837447522').should('be.visible').clear().type(`This is a test description for E2E FSLE ${timestamp}`);

    cy.selectReactSelectOption('.input-courseAccessType > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', 'FS');
    cy.selectReactSelectOption('.input-supportedApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', null);

    cy.getLastCreatedConferenceBrand().then((brandName) => {
      cy.wait(1000);
      cy.selectReactSelectOption('.css-1szy77t-control > .css-1hwfws3', brandName);
    });

    cy.getLastCreatedConferenceBrandSeries('FSLE').then((seriesName) => {
      cy.selectReactSelectOption(':nth-child(4) > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', seriesName);
    });

    cy.get('.input-unpublishingDate .rdt .form-control').should('be.visible').scrollIntoView().click();
    cy.wait(500);
    cy.get('.input-unpublishingDate .rdtNext').first().click();
    cy.wait(500);
    cy.get('.input-unpublishingDate').then(($c) => {
      const today = $c.find('.rdtDay.rdtToday');
      if (today.length > 0) cy.wrap(today.first()).click();
      else cy.wrap($c.find('.rdtDay:not(.rdtOld)').first()).click();
    });
    cy.wait(1000);

    cy.scrollTo(0, 800);
    cy.wait(1000);

    cy.get('#frc-slug-1053376469').scrollIntoView().should('be.visible').clear().type(fsleName.toLowerCase().replace(/ /g, '-'));

    cy.get('body').then(($body) => {
      const colourField = $body.find('input[id*="colour"], input[id*="color"]').not('#frc-slug-1053376469').not('#frc-headlineColourHexCode-616139814').first();
      if (colourField.length > 0) cy.wrap(colourField).clear().type('#000000');
    });
    cy.get('#frc-headlineColourHexCode-616139814').should('be.visible').clear().type('#000000');
    cy.wait(500);

    cy.get('button.submit-button[type="submit"], button:contains("Speichern")').first().scrollIntoView().should('contain', 'Speichern').click();
    cy.wait(2000);

    cy.storeLastCreatedFSLE(fsleName);

    cy.visit('/live_events?option=blockbusters');
    cy.wait(2000);
    cy.get('.subMenu > :nth-child(3) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);

    cy.get('.datatable-search').should('be.visible').clear().type(fsleName);
    cy.wait(2000);

    cy.contains(fsleName, { timeout: 10000 }).should('be.visible').first().click();
    cy.wait(2000);

    cy.get('[style="margin-top: 2%; margin-left: 0.5%; margin-right: 0.5%;"] > :nth-child(1) > :nth-child(2) > .jss7').should('be.visible').click();
    cy.wait(2000);

    cy.get('.modal-trigger > .jss32 > .jss7').should('be.visible').click();
    cy.wait(3000);

    cy.get('body').then(($body) => {
      const nameField = $body.find('input[id*="name"], input[name*="name"]').not('[type="hidden"]').first();
      if (nameField.length > 0) {
        cy.wrap(nameField).scrollIntoView().should('be.visible').clear().type(`E2E Lesson ${timestamp}`);
      } else {
        cy.get('input[type="text"]').first().clear().type(`E2E Lesson ${timestamp}`);
      }
    });

    cy.get('#frc-description--837447522').scrollIntoView().should('be.visible').clear().type(`This is a test description for E2E Lesson ${timestamp}`);

    cy.get('.input-language > .jss347 > .jss390 > .jss420 > .jss421').first().should('be.visible').scrollIntoView().click();
    cy.wait(1000);
    cy.get('body').then(($body) => {
      const opts = $body.find('[role="option"]');
      const english = opts.filter((i, el) => Cypress.$(el).text().toLowerCase().includes('english'));
      if (english.length > 0) cy.wrap(english.first()).click();
      else if (opts.length >= 2) cy.wrap(opts.eq(1)).click();
      else cy.wrap(opts.first()).click();
    });

    cy.get('.input-startDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control').should('be.visible').scrollIntoView().click();
    cy.wait(500);
    cy.get('body').then(($body) => {
      const today = $body.find('.rdtDay.rdtToday');
      if (today.length > 0) cy.wrap(today.first()).click();
      else cy.get('.rdtDay:not(.rdtOld)').first().click();
    });

    cy.get('.input-endDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control').should('be.visible').scrollIntoView().click();
    cy.wait(500);
    cy.get('.input-endDate .rdtNext').first().click();
    cy.wait(500);
    cy.get('.input-endDate').then(($c) => {
      const today = $c.find('.rdtDay.rdtToday');
      if (today.length > 0) cy.wrap(today.first()).click();
      else cy.wrap($c.find('.rdtDay:not(.rdtOld)').first()).click();
    });
    cy.wait(1000);

    cy.get('.input-videoType [role="combobox"], .input-videoType [role="button"], .input-videoType .MuiSelect-select, .input-videoType > div > div').first().scrollIntoView().click();
    cy.wait(500);
    cy.get('[role="option"]').filter((i, el) => Cypress.$(el).text().includes('NONE')).first().click();

    cy.get('button.submit-button[type="submit"], button:contains("Speichern")').first().scrollIntoView().should('contain', 'Speichern').click();
    cy.wait(2000);

    cy.get('[style="margin-top:2%;margin-left:.5%;margin-right:.5%"] > :nth-child(1) > :nth-child(1) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);
    cy.get(':nth-child(4) > :nth-child(1) > .jss7').should('exist').click({ force: true });
    cy.wait(3000);
    cy.get(':nth-child(4) > :nth-child(1) > .jss7').should('exist').click({ force: true });
    cy.wait(2000);

    cy.log(`✅ FSLE "${fsleName}" created and published`);
  });

  it('Step 4: Create Camps with lesson and publish', () => {
    cy.log('=== STEP 4: Creating Camps ===');
    cy.loginAs('admin');

    cy.visit('/live_events?option=blockbusters');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);

    cy.get('.subMenu > :nth-child(4) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);

    cy.get('body').then(($body) => {
      const btn = $body.find('button:contains("NEW CAMP"), a:contains("NEW CAMP"), button:contains("NEW CAMPS"), a:contains("NEW CAMPS")')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('new') && (text.includes('camp') || text.includes('camps'));
        });
      if (btn.length > 0) cy.wrap(btn.first()).should('be.visible').click();
      else cy.get('button[type="button"], a[href*="camp"]').contains(/NEW (CAMP|CAMPS)/i).click();
    });

    cy.wait(5000);
    cy.get('input, textarea, select', { timeout: 15000 }).first().should('exist');
    cy.wait(2000);

    cy.scrollTo(0, 500);
    cy.wait(1000);

    cy.get('#frc-name--1782415253').scrollIntoView().should('be.visible').clear().type(campsName);
    cy.get('#frc-slogan--66047816').should('be.visible').clear().type(`E2E Camps Slogan ${timestamp}`);
    cy.get('#frc-description--837447522').should('be.visible').clear().type(`This is a test description for E2E Camps ${timestamp}`);

    cy.selectReactSelectOption('.input-supportedApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', null);

    cy.getLastCreatedConferenceBrand().then((brandName) => {
      cy.wait(1000);
      cy.selectReactSelectOption('.css-1szy77t-control > .css-1hwfws3', brandName);
    });

    cy.getLastCreatedConferenceBrandSeries('CAMP').then((seriesName) => {
      cy.selectReactSelectOption(':nth-child(4) > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', seriesName);
    });

    cy.scrollTo(0, 800);
    cy.wait(1000);

    cy.get('#frc-slug-1053376469').scrollIntoView().should('be.visible').clear().type(campsName.toLowerCase().replace(/ /g, '-'));

    cy.get('body').then(($body) => {
      const colourField = $body.find('input[id*="colour"], input[id*="color"]').not('#frc-slug-1053376469').not('#frc-headlineColourHexCode-616139814').first();
      if (colourField.length > 0) cy.wrap(colourField).clear().type('#000000');
    });
    cy.get('#frc-headlineColourHexCode-616139814').should('be.visible').clear().type('#000000');
    cy.wait(500);

    cy.get('button.submit-button[type="submit"], button:contains("Speichern")').first().scrollIntoView().should('contain', 'Speichern').click();
    cy.wait(2000);

    cy.storeLastCreatedCamps(campsName);

    cy.visit('/live_events?option=blockbusters');
    cy.wait(2000);
    cy.get('.subMenu > :nth-child(4) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);

    cy.get('.datatable-search').should('be.visible').clear().type(campsName);
    cy.wait(2000);

    cy.contains(campsName, { timeout: 10000 }).should('be.visible').first().click();
    cy.wait(2000);

    cy.get('[style="margin-top: 2%; margin-left: 0.5%; margin-right: 0.5%;"] > :nth-child(1) > :nth-child(2) > .jss7').should('be.visible').click();
    cy.wait(2000);

    cy.get('.modal-trigger > .jss32 > .jss7').should('be.visible').click();
    cy.wait(3000);

    cy.get('body').then(($body) => {
      const nameField = $body.find('input[id*="name"], input[name*="name"]').not('[type="hidden"]').first();
      if (nameField.length > 0) {
        cy.wrap(nameField).scrollIntoView().should('be.visible').clear().type(`E2E Lesson ${timestamp}`);
      } else {
        cy.get('input[type="text"]').first().clear().type(`E2E Lesson ${timestamp}`);
      }
    });

    cy.get('#frc-description--837447522').scrollIntoView().should('be.visible').clear().type(`This is a test description for E2E Lesson ${timestamp}`);

    cy.get('.input-language > .jss347 > .jss390 > .jss420 > .jss421').first().should('be.visible').scrollIntoView().click();
    cy.wait(1000);
    cy.get('body').then(($body) => {
      const opts = $body.find('[role="option"]');
      const english = opts.filter((i, el) => Cypress.$(el).text().toLowerCase().includes('english'));
      if (english.length > 0) cy.wrap(english.first()).click();
      else if (opts.length >= 2) cy.wrap(opts.eq(1)).click();
      else cy.wrap(opts.first()).click();
    });

    cy.get('.input-startDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control').should('be.visible').scrollIntoView().click();
    cy.wait(500);
    cy.get('body').then(($body) => {
      const today = $body.find('.rdtDay.rdtToday');
      if (today.length > 0) cy.wrap(today.first()).click();
      else cy.get('.rdtDay:not(.rdtOld)').first().click();
    });

    cy.get('.input-endDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control').should('be.visible').scrollIntoView().click();
    cy.wait(500);
    cy.get('.input-endDate .rdtNext').first().click();
    cy.wait(500);
    cy.get('.input-endDate').then(($c) => {
      const today = $c.find('.rdtDay.rdtToday');
      if (today.length > 0) cy.wrap(today.first()).click();
      else cy.wrap($c.find('.rdtDay:not(.rdtOld)').first()).click();
    });
    cy.wait(1000);

    cy.get('.input-videoType [role="combobox"], .input-videoType [role="button"], .input-videoType .MuiSelect-select, .input-videoType > div > div').first().scrollIntoView().click();
    cy.wait(500);
    cy.get('[role="option"]').filter((i, el) => Cypress.$(el).text().includes('NONE')).first().click();

    cy.get('button.submit-button[type="submit"], button:contains("Speichern")').first().scrollIntoView().should('contain', 'Speichern').click();
    cy.wait(2000);

    cy.get('[style="margin-top:2%;margin-left:.5%;margin-right:.5%"] > :nth-child(1) > :nth-child(1) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);
    cy.get(':nth-child(4) > :nth-child(1) > .jss7').should('exist').click({ force: true });
    cy.wait(3000);
    cy.get(':nth-child(4) > :nth-child(1) > .jss7').should('exist').click({ force: true });
    cy.wait(2000);

    cy.log(`✅ Camps "${campsName}" created and published`);
  });

  it('Step 5: Create Flex Camps with lesson and publish', () => {
    cy.log('=== STEP 5: Creating Flex Camps ===');
    cy.loginAs('admin');

    cy.visit('/live_events?option=blockbusters');
    cy.contains('Not Allowed').should('not.exist');
    cy.wait(2000);

    cy.get('.subMenu > :nth-child(5) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);

    cy.get('body').then(($body) => {
      const btn = $body.find('button:contains("NEW FLEX CAMP"), a:contains("NEW FLEX CAMP"), button:contains("NEW FLEX CAMPS"), a:contains("NEW FLEX CAMPS")')
        .filter((i, el) => {
          const text = Cypress.$(el).text().toLowerCase();
          return text.includes('new') && text.includes('flex') && (text.includes('camp') || text.includes('camps'));
        });
      if (btn.length > 0) cy.wrap(btn.first()).should('be.visible').click();
      else cy.get('button[type="button"], a[href*="flex"], a[href*="camp"]').contains(/NEW FLEX (CAMP|CAMPS)/i).click();
    });

    cy.wait(5000);
    cy.get('input, textarea, select', { timeout: 15000 }).first().should('exist');
    cy.wait(2000);

    cy.scrollTo(0, 500);
    cy.wait(1000);

    cy.get('#frc-name--1782415253').scrollIntoView().should('be.visible').clear().type(flexCampsName);
    cy.get('#frc-slogan--66047816').should('be.visible').clear().type(`E2E Flex Camps Slogan ${timestamp}`);
    cy.get('#frc-description--837447522').should('be.visible').clear().type(`This is a test description for E2E Flex Camps ${timestamp}`);

    cy.selectReactSelectOption('.input-supportedApps > .form-group > .drop-down > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', null);

    cy.getLastCreatedConferenceBrand().then((brandName) => {
      cy.wait(1000);
      cy.selectReactSelectOption('.css-1szy77t-control > .css-1hwfws3', brandName);
    });

    cy.getLastCreatedConferenceBrandSeries('FLEX_CAMP').then((seriesName) => {
      cy.selectReactSelectOption(':nth-child(4) > .css-1pcexqc-container > .css-bg1rzq-control > .css-1hwfws3', seriesName);
    });

    cy.scrollTo(0, 800);
    cy.wait(1000);

    cy.get('#frc-slug-1053376469').scrollIntoView().should('be.visible').clear().type(flexCampsName.toLowerCase().replace(/ /g, '-'));

    cy.get('body').then(($body) => {
      const colourField = $body.find('input[id*="colour"], input[id*="color"]').not('#frc-slug-1053376469').not('#frc-headlineColourHexCode-616139814').first();
      if (colourField.length > 0) cy.wrap(colourField).clear().type('#000000');
    });
    cy.get('#frc-headlineColourHexCode-616139814').should('be.visible').clear().type('#000000');
    cy.wait(500);

    cy.get('button.submit-button[type="submit"], button:contains("Speichern")').first().scrollIntoView().should('contain', 'Speichern').click();
    cy.wait(2000);

    cy.storeLastCreatedFlexCamps(flexCampsName);

    cy.visit('/live_events?option=blockbusters');
    cy.wait(2000);
    cy.get('.subMenu > :nth-child(5) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);

    cy.get('.datatable-search').should('be.visible').clear().type(flexCampsName);
    cy.wait(2000);

    cy.contains(flexCampsName, { timeout: 10000 }).should('be.visible').first().click();
    cy.wait(2000);

    cy.get('[style="margin-top: 2%; margin-left: 0.5%; margin-right: 0.5%;"] > :nth-child(1) > :nth-child(2) > .jss7').should('be.visible').click();
    cy.wait(2000);

    cy.get('.modal-trigger > .jss32 > .jss7').should('be.visible').click();
    cy.wait(3000);

    cy.get('body').then(($body) => {
      const nameField = $body.find('input[id*="name"], input[name*="name"]').not('[type="hidden"]').first();
      if (nameField.length > 0) {
        cy.wrap(nameField).scrollIntoView().should('be.visible').clear().type(`E2E Lesson ${timestamp}`);
      } else {
        cy.get('input[type="text"]').first().clear().type(`E2E Lesson ${timestamp}`);
      }
    });

    cy.get('#frc-description--837447522').scrollIntoView().should('be.visible').clear().type(`This is a test description for E2E Lesson ${timestamp}`);

    cy.get('.input-language > .jss347 > .jss390 > .jss420 > .jss421').first().should('be.visible').scrollIntoView().click();
    cy.wait(1000);
    cy.get('body').then(($body) => {
      const opts = $body.find('[role="option"]');
      const english = opts.filter((i, el) => Cypress.$(el).text().toLowerCase().includes('english'));
      if (english.length > 0) cy.wrap(english.first()).click();
      else if (opts.length >= 2) cy.wrap(opts.eq(1)).click();
      else cy.wrap(opts.first()).click();
    });

    cy.get('.input-startDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control').should('be.visible').scrollIntoView().click();
    cy.wait(500);
    cy.get('body').then(($body) => {
      const today = $body.find('.rdtDay.rdtToday');
      if (today.length > 0) cy.wrap(today.first()).click();
      else cy.get('.rdtDay:not(.rdtOld)').first().click();
    });

    cy.get('.input-endDate > :nth-child(1) > [style="width: 75%; float: left;"] > .rdt > .form-control').should('be.visible').scrollIntoView().click();
    cy.wait(500);
    cy.get('.input-endDate .rdtNext').first().click();
    cy.wait(500);
    cy.get('.input-endDate').then(($c) => {
      const today = $c.find('.rdtDay.rdtToday');
      if (today.length > 0) cy.wrap(today.first()).click();
      else cy.wrap($c.find('.rdtDay:not(.rdtOld)').first()).click();
    });
    cy.wait(1000);

    cy.get('.input-videoType [role="combobox"], .input-videoType [role="button"], .input-videoType .MuiSelect-select, .input-videoType > div > div').first().scrollIntoView().click();
    cy.wait(500);
    cy.get('[role="option"]').filter((i, el) => Cypress.$(el).text().includes('NONE')).first().click();

    cy.get('button.submit-button[type="submit"], button:contains("Speichern")').first().scrollIntoView().should('contain', 'Speichern').click();
    cy.wait(2000);

    cy.get('[style="margin-top:2%;margin-left:.5%;margin-right:.5%"] > :nth-child(1) > :nth-child(1) > .MuiButton-label-7').should('be.visible').click();
    cy.wait(2000);
    cy.get(':nth-child(4) > :nth-child(1) > .jss7').should('exist').click({ force: true });
    cy.wait(3000);
    cy.get(':nth-child(4) > :nth-child(1) > .jss7').should('exist').click({ force: true });
    cy.wait(2000);

    cy.log(`✅ Flex Camps "${flexCampsName}" created and published`);
    cy.log(`✅ Full flow complete! Conference Brand, Tutorial, FSLE, Camps, and Flex Camps all created and published.`);
  });
});
