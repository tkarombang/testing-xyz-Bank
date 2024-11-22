describe('The Homepage open application', () => {
  it('Open the homepage', () => {
    cy.visit('/')

    cy.contains('XYZ Bank')
    // Should be on a new URL which
    // includes '/customer
  })
})

describe('Customer Login', () => {
  beforeEach('Memeriksa Username', () => {
    cy.visit('/customer')
    cy.contains('Customer Login').click()
    cy.url().should('include', '/customer')
    cy.get('#userSelect').select('Harry Potter')
    cy.contains('Login')
      .should('have.text', 'Login')
      .click()
  })

  it('Gagal Kembali ke-halaman detail user', () => {
    cy.contains('Home').click()
    cy.get('.btn-detail')
      .should('exist')
      .and('be.visible')
  })

  it('Berhasil menampilkan text username', () => {
    cy.get('.fontBig')
      .invoke('text')
      .then((username) => {
        cy.log('Pengguna adalah :', username)
        expect(username).to.equal('Harry Potter')
      })
    cy.get('div.center').should('be.visible')
  })

  it('Berhasil melakukan deposit', () => {
    cy.contains('Deposit').click()
    cy.get('.form-control').type('123456')
    cy.get('form.ng-dirty').submit()
    cy.get('.error')
    .invoke('text')
    .then((txtSucces) => {
      cy.log('Bahwa ', txtSucces)
      expect(txtSucces).to.equal('Deposit Successful')
    })
  })
})