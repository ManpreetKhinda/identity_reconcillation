const express = require('express');
const contactRoutes = require('./routes/contactRoutes');
const pool = require('./utils/db');

// Define the SQL query to create the table
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(20),
    email VARCHAR(100),
    linkedId INT REFERENCES contacts(id) ON DELETE SET NULL, 
    linkPrecedence VARCHAR(10) CHECK (linkPrecedence IN ('primary', 'secondary')) NOT NULL,
    createdAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updatedAt TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deletedAt TIMESTAMPTZ
  )
`;

// Execute the query to create the table
(async () => {
  try {
    await pool.query(createTableQuery);
    console.log('Table created successfully');
  } catch (err) {
    console.error('Error creating table:', err);
  }
})();
const app = express();
app.use(express.json());

// Define a root route
app.get('/', (req, res) => {
    res.send('Welcome to the Identity Reconciliation API');
});

// Define API routes
app.use('/api', contactRoutes);

// Handle undefined routes
app.use((req, res) => {
    res.status(404).send('Route not found');
});

module.exports = app;