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
    cy.contains('Bank Manager Login').click()
  })

  it('Memastikan Customer Baru berhasil telah ditambahkan', () => {
    cy.get('button', { timeout: 3000 })
      .contains('Add Customer')
      .click()
    cy.get('input[placeholder="First Name"]').type('Azwar')
    cy.get('input[placeholder="Last Name"]').type('Anas')
    cy.get('input[placeholder="Post Code"]').type('54321')
    cy.get('.btn-default').click()

    cy.wait(3000)
    cy.on('window:alert', (successMessage) => {
      expect(successMessage).to.contains('Customer added successfully with customer id :')
      const splitText = alertText.split(':') // PECAH TEKS BERDASARKAN :
      const customerId = splitText[i].trim() // AMBIL BAGIAN SETELAH ":" DAN HILANGKAN SPASI
      cy.log(`Customer ID: ${customerId}`)
      expect(parseInt(customerId)).to.be.gratherThan(0)
    })
  })

  it('Memastikan Last Name Kosong: Customer Baru berhasil telah ditambahkan', () => {
    cy.get('button', { timeout: 3000 })
      .contains('Add Customer')
      .click()
    cy.get('input[placeholder="First Name"]').type('Robin')
    cy.get('input[placeholder="Post Code"]').type('54321')
    cy.get('.btn-default').click()

    cy.get('input[placeholder="Last Name"]').then((input) => {
      const isValid = input[0].checkValidity();
      const validationMessage = input[0].validationMessage;

      expect(isValid).to.be.false
      expect(validationMessage).to.equal('Please fill out this field.')
    })
  })


  it('Memastikan customer Open Account with Dollar', () => {
    cy.get('button', { timeout: 3000 })
      .contains('Add Customer')
      .click()
    cy.get('input[placeholder="First Name"]').type('Rudi')
    cy.get('input[placeholder="Last Name"]').type('Habibi')
    cy.get('input[placeholder="Post Code"]').type('54321')
    cy.get('.btn-default').click()

    cy.wait(3000)
    cy.contains('Open Account').click()
    cy.get('#userSelect').select('Rudi Habibi')
    cy.get('#currency').select('Dollar')
    cy.contains('Process').click()
  })

  it('Memastikan dapat menghapus satu akun customer', () => {
    cy.contains('Customers').click()
    cy.contains('tr', 'Ron').find('button').click()
    cy.contains('tr', 'Ron').should('not.exist') //memastikan baris yg dihuni Ron telah terhapus
  })

  it('Mencari Customer berdasarkan karakter', () => {
    const charSearch = 'He'
    let ygDicari = false
    cy.contains('Customers').click()
    cy.get('.form-control').type(charSearch)

    cy.wait(5000)
    //VERIFIKASI DAFTAR CUSTOMER YANG MEMILIKI HURUF dalam variabel charSearch
    cy.get('table tbody tr').each((tabel) => {
      cy.wrap(tabel)
        .find('td')
        .each((cell)=> {
          cy.log(cell.text())
        })
       .then((isiTabel) => {
        const ygDicari = Array.from(isiTabel).some((kolom) => kolom.innerText.toLowerCase().includes(charSearch.toLowerCase()))

        expect(ygDicari).to.be.true
      })
    })
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
        expect(username).to.equal('Hermoine Granger')
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