// src/services/contactService.js

const {
  findContacts,
  createContact,
  updateContact,
} = require("../models/contactModel");
const pool = require("../utils/db"); // Ensure pool is imported from your DB utility file

const identifyContact = async (email, phoneNumber) => {
  // Create a new contact entry
  const newContact = await createContact(email, phoneNumber);

  // Find existing contacts with the same email or phone number
  const contacts = await findContacts(email, phoneNumber);

  // If no contacts are found, return the new contact with secondaryContactIds as null
  if (contacts.length === 0) {
    return {
      contact: {
        primaryContactId: newContact.id,
        emails: [newContact.email],
        phoneNumbers: [newContact.phoneNumber],
        secondaryContactIds: [],
      },
    };
  }

  // Determine the primary contact of the set
  const primaryContact = contacts.reduce((oldest, contact) => {
    return contact.id < oldest.id ? contact : oldest;
  }, contacts[0]);

  // If the new contact is the primary contact, return it with secondaryContactIds as null
  if (newContact.id === primaryContact.id) {
    return {
      contact: {
        primaryContactId: primaryContact.id,
        emails: [primaryContact.email],
        phoneNumbers: [primaryContact.phoneNumber],
        secondaryContactIds: [],
      },
    };
  }

  // Update all linked contacts to point to the primary contact
  await Promise.all(
    contacts.map(async (contact) => {
      if (
        contact.id !== primaryContact.id &&
        contact.linkedId !== primaryContact.id
      ) {
        await updateContact(contact.id, primaryContact.id, "secondary");
      }
    })
  );

  // Fetch all contacts linked to the primary contact
  const updatedContacts = await findContactsByPrimarySet(primaryContact.id);

  // Prepare the response with the final merged set
  return formatResponse(primaryContact.id, updatedContacts);
};

// Function to find all contacts linked to the primary set
const findContactsByPrimarySet = async (primarySetId) => {
  const query = `SELECT * FROM Contacts WHERE linkedId = $1 OR id = $1`;
  const { rows } = await pool.query(query, [primarySetId]);
  return rows;
};

const formatResponse = (primarySetId, contacts) => {
  return {
    contact: {
      primaryContactId: primarySetId,
      emails: [...new Set(contacts.map((c) => c.email).filter(Boolean))],
      phoneNumbers: [
        ...new Set(contacts.map((c) => c.phoneNumber).filter(Boolean)),
      ],
      secondaryContactIds: contacts
        .filter((c) => c.id !== primarySetId)
        .map((c) => c.id),
    },
  };
};

module.exports = {
  identifyContact,
};
