describe('Load Contact Page Screen', () => {
  it('Contains a form with required inputs and buttons', () => {
    cy.visit('/contact')
    cy.get(`[data-cy=first-name-input]`).should('exist')
    cy.get(`[data-cy=email-input]`).should('exist')
    cy.get(`[data-cy=message-input]`).should('exist')
    cy.get(`[data-cy=toa-checkbox]`).should('exist')
    cy.get(`[data-cy=send-message-button]`).should('exist')
  })
})


describe('Contact Form interaction', () => {
  it('Display a toaster when Form submits', () => {
    cy.visit('/contact')
    cy.wait(500)
    cy.get(`.p-toast-summary`).should('not.exist');

    cy.get(`[data-cy=first-name-input]`).type('My Name');
    cy.get(`[data-cy=email-input]`).type('myname@email.com');
    cy.get(`[data-cy=message-input]`).type('A short message');
    cy.get(`[data-cy=toa-checkbox]`).click();
    cy.get(`[data-cy=send-message-button]`).click();

    cy.get(`.p-toast-summary`).should('exist');
  })

  it('Display a invalid input message for First Name', () => {
    cy.visit('/contact')
    cy.wait(500)
    cy.get(`[data-cy=first-name-input]`).type('M');
    cy.get(`[data-cy=first-name-help]`).contains('Invalid First Name');
  })

  it('Keep Button disabled if no ToA not checked', () => {
    cy.visit('/contact')
    cy.visit('/contact')
    cy.wait(500)
    cy.get(`[data-cy=first-name-input]`).type('My Name');
    cy.get(`[data-cy=email-input]`).type('myname@email.com');
    cy.get(`[data-cy=message-input]`).type('A short message');
    // cy.get(`[data-cy=send-message-button]`).should('be.disabled'); // Seems 'disabled' not supported by p-button

    // Workaround: check that toaster is not displayed cause nothing happened on click
    cy.get(`[data-cy=send-message-button]`).click();
    cy.get(`.p-toast-summary`).should('not.exist');
  })
})

