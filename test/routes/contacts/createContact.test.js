import fastify from 'fastify'
import fp from 'fastify-plugin'
import app from '../../../app.js'

const server = fastify()

server.register(fp(app))

describe('/contacts', () => {
  describe('POST should', () => {
    describe('create a contact', () => {
      it('with all required fields', async () => {
        const contact = {
          firstName: 'John',
          lastName: 'Doe',
          phoneNumber: '+34644755866',
          birthday: '1989-03-18'
        }

        const response = await server.inject({
          url: '/contacts',
          method: 'POST',
          body: contact
        })
        const newContact = response.json()

        expect(response.statusCode).toBe(201)
        expect(typeof newContact.id).toBe('string')
        expect(newContact.firstName).toBe(contact.firstName)
      })

      it('without birthday', async () => {
        const response = await server.inject({
          url: '/contacts',
          method: 'POST',
          body: {
            firstName: 'John',
            lastName: 'Doe',
            phoneNumber: '+34644755866'
          }
        })

        expect(response.statusCode).toBe(201)
      })

      it('validating phone number', async () => {
        for await (const [phoneNumber, response] of createContactWithValidPhoneFormat()) {
          try {
            expect(response.statusCode).toBe(201)
          } catch {
            throw new Error(`Valid phone number "${phoneNumber}" didn't pass the validation process.`)
          }
        }
      })
    })

    describe('return a 400 error ', () => {
      it('if first name is missing', async () => {
        const response = await server.inject({
          url: '/contacts',
          method: 'POST',
          body: {
            lastName: 'Doe',
            phoneNumber: '+34644755866',
            birthday: '1989-03-18'
          }
        })

        expect(response.statusCode).toBe(400)
      })

      it('if last name is missing', async () => {
        const response = await server.inject({
          url: '/contacts',
          method: 'POST',
          body: {
            firstName: 'John',
            phoneNumber: '+34644755866',
            birthday: '1989-03-18'
          }
        })

        expect(response.statusCode).toBe(400)
      })

      it('if phone number is missing', async () => {
        const response = await server.inject({
          url: '/contacts',
          method: 'POST',
          body: {
            firstName: 'John',
            lastName: 'Doe',
            birthday: '1989-03-18'
          }
        })

        expect(response.statusCode).toBe(400)
      })

      it('if phone number format is wrong', async () => {
        for await (const [phoneNumber, response] of createContactWithWrongPhoneFormat()) {
          try {
            expect(response.statusCode).toBe(400)
          } catch {
            throw new Error(`Invalid phone number "${phoneNumber}" passed the validation process.`)
          }
        }
      })
    })
  })
})

async function * createContactWithWrongPhoneFormat () {
  const wrongPhoneNumbers = [
    'asda',
    '1234',
    '34644755866',
    ''
  ]

  for (const phoneNumber of wrongPhoneNumbers) {
    const response = await server.inject({
      url: '/contacts',
      method: 'POST',
      body: {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber,
        birthday: '1989-03-18'
      }
    })

    yield [phoneNumber, response]
  }
}

async function * createContactWithValidPhoneFormat () {
  const validPhoneNumbers = [
    '+34644755866',
    '+34 644755866',
    '+34 644 755 866',
    '644 755 866',
    '644 75 58 66'
  ]

  for (const phoneNumber of validPhoneNumbers) {
    const response = await server.inject({
      url: '/contacts',
      method: 'POST',
      body: {
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber,
        birthday: '1989-03-18'
      }
    })

    yield [phoneNumber, response]
  }
}
