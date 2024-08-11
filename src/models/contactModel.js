const pool = require("../utils/db");

const findContacts = async (email, phoneNumber) => {
  const query = `SELECT * FROM contacts 
                   WHERE ($1::text IS NULL OR email = $1) 
                   OR ($2::text IS NULL OR phoneNumber = $2)`;
  const { rows } = await pool.query(query, [
    email || null,
    phoneNumber || null,
  ]);
  console.log('Contacts found:', rows);
  return rows;
};

const createContact = async (email, phoneNumber) => {
  const query = `INSERT INTO contacts (email, phoneNumber, linkPrecedence, createdAt, updatedAt) 
                   VALUES ($1, $2, 'primary', NOW(), NOW()) RETURNING *`;
  const { rows } = await pool.query(query, [email, phoneNumber]);
  console.log('New contact created:', rows[0]);
  return rows[0];
};

const updateContact = async (id, linkedId, linkPrecedence) => {
  const query = `UPDATE contacts SET linkedId = $1, linkPrecedence = $2, updatedAt = NOW() WHERE id = $3 RETURNING *`;
  const { rows } = await pool.query(query, [linkedId, linkPrecedence, id]);
  return rows[0];
};

module.exports = {
  findContacts,
  createContact,
  updateContact,
};


