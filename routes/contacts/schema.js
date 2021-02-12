import S from 'fluent-schema'

export const contactExample = {
  firstName: 'Ulises',
  lastName: 'Santana Suárez',
  phoneNumber: '+34616864260',
  birthday: '1989-03-18'
}

export const contactExampleId = {
  id: 'a8yfdg89qfy1hrh8g-1pasdf',
  ...contactExample
}

export const contact = S.object()
  .title('Contact')
  .raw({ example: contactExample })
  .prop('firstName', S.string())
  .prop('lastName', S.string())
  .prop('phoneNumber', S.string().pattern(/^\+?(\d|\s)+/))
  .prop('birthday', S.string().format('date'))
  .required(['firstName', 'lastName', 'phoneNumber'])

export const contactWithId = contact.extend(
  S.object()
    .raw({ example: contactExampleId })
    .prop('id', S.string())
    .required()
)

export const findAllContacts = {
  tags: ['contacts'],
  summary: 'Get all contacts',
  response: {
    200: S.array()
      .description('Successful response')
      .items(contactWithId)
  }
}

export const createContact = {
  tags: ['contacts'],
  summary: 'Add a new contact',
  body: contact,
  response: {
    201: contactWithId
  }
}
