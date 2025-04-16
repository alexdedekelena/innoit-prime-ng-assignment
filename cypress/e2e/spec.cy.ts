describe('Pages loads', () => {
  it('Visits the initial project page', () => {
    cy.visit('/')
    cy.contains('Contact')
  })
})
