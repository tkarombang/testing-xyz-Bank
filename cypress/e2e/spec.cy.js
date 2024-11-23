describe('The Homepage open application', () => {
  it('Open the homepage', () => {
    cy.visit('/')

    cy.contains('XYZ Bank')
    // Should be on a new URL which
    // includes '/customer
  })
})

describe('Bank Manager Login', () => {
    beforeEach('Memeriksa Username', () => {
    cy.visit('/manager')
  })

  it('Memastikan Customer Baru berhasil telah ditambahkan', () => {
    cy.contains('Bank Manager Login').click()
    cy.get('button', { timeout: 3000 })
      .contains('Add Customer')
      .click()
    cy.get('input[placeholder="First Name"]').type('Azwar')
    cy.get('input[placeholder="Last Name"]').type('Anas')
    cy.get('input[placeholder="Post Code"]').type('54321')
    cy.get('.btn-default').click()

  })
})

describe('Customer Login', () => {
  beforeEach('Memeriksa Username', () => {
    cy.visit('/customer')
    cy.contains('Customer Login').click()
    cy.url().should('include', '/customer')
    cy.get('#userSelect').select('Hermoine Granger')
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

  it('memastikan transaksi dapat terlihat', () => {
    cy.contains('Deposit').click()
    for (let i = 0; i < 2; i++) {
      cy.get('.form-control').type('5000')
      cy.get('form.ng-dirty').submit()
      cy.contains('Deposit Successful', { timeout: 5000 })
    }
    cy.contains('Transactions').click()
    cy.get('.table')
      .invoke('text')
      .then((tanggal) => {
        cy.log('tanggal', tanggal)
      })
    cy.contains('Date-Time').click()
  })

  it('Tidak dapat melakukan pengurutan berdasarkan jumlah transaksi', () => {
    cy.contains('Deposit').click()
    cy.get('.form-control').type('5000')
    cy.get('form.ng-dirty').submit()
    cy.contains('Deposit Successful', { timeout: 5000 })
    cy.contains('Transactions').click()
    cy.get('.table')
      .invoke('text')
      .then((tanggal) => {
        cy.log('tanggal', tanggal)
      })
    cy.get('a')
      .contains('Amount')
      .then((amount) => {
        if(!amount[0].hasAttribute('onclick')){
          throw new Error('Amount tidak memiliki even handler')
        }
      })
      .click({ force: true })
  })

  it('Mengurangi nilai Balance', () => {
    let bSaldo, aSaldo
    cy.get('div.center:nth-child(3)', { timeout: 5000 })
      .contains('Balance :')
      .find('strong.ng-binding:nth-child(2)')
      .invoke('text')
      .then((beforeWithdrawl) => {
        bSaldo = parseFloat(beforeWithdrawl.trim())
        cy.log('Before Withdrawl :', bSaldo)
      })

    cy.contains('Withdrawl').click()
    cy.get('.form-control').type('96')
    cy.get('form.ng-dirty').submit()

    cy.get('div.center:nth-child(3)', { timeout: 5000 })
    .contains('Balance :')
    .find('strong.ng-binding:nth-child(2)')
    .invoke('text')
    .then((afterWithdrawl) => {
      aSaldo = parseFloat(afterWithdrawl.trim())
      cy.log('After Withdrawl :', aSaldo)

      expect(aSaldo).to.equal(bSaldo - 96)
    })

  })

})