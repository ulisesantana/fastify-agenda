import { findAllContacts, createContact } from './schema.js'
import HttpError from 'http-errors'
const db = []

async function contactAPI (server, opts) {
  server.route({
    method: 'GET',
    url: '/',
    schema: findAllContacts,
    handler: () => {
      return db
    }
  })

  server.route({
    method: 'POST',
    url: '/',
    schema: createContact,
    handler: createContactHandler
  })
}

async function createContactHandler (request, reply) {
  const phoneNumber = request.body.phoneNumber.split(/\s/).join('')

  if (validatePhone(phoneNumber)) {
    const newContact = {
      ...request.body,
      id: String(Date.now() * Math.random()),
      phoneNumber
    }

    db.push(newContact)

    reply.status(201).send(newContact)
  } else {
    throw HttpError(400, 'Invalid phone format.')
  }
}

function validatePhone (phone) {
  if (phone.startsWith('+')) {
    return phone.length >= 11 && phone.length <= 14
  } else {
    return phone.length === 9
  }
}

export default contactAPI
