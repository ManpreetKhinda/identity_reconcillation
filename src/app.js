const express = require('express');
const contactRoutes = require('./routes/contactRoutes');

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