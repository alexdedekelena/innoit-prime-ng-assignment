describe('Load Countries Page Screen', () => {
  it('Contains a button to add countries', () => {
    cy.visit('/countries');
    cy.get(`[data-cy=add-country-button]`).should('exist');
  })
})


describe('Add Country interaction', () => {
  it('Contains a dialog with selector to select countries from list', () => {
    cy.visit('/countries')
    cy.wait(500);
    cy.get(`[data-cy=add-country-button]`).click();
    cy.wait(500);
    cy.get(`[data-cy=country-select]`).should('exist');
  })

  it('Contains the selected country on table', () => {
    cy.visit('/countries')
    cy.wait(500);
    cy.get(`[data-cy=add-country-button]`).click();
    cy.wait(500);

    // Workaround on p-select seems doesn't support .select()
    cy.get(`[data-cy=country-select]`).type('Argentina');
    cy.get(`li[role="option"]`).click();
    cy.get(`[data-cy=add-selected-button]`).click();

    cy.wait(500);
    cy.get(`[data-cy=countries-table]`).contains('Argentina');
  })
})

