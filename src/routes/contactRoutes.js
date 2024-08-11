const express = require('express');
const { identify } = require('../controllers/contactController');
const router = express.Router();

router.post('/identify', identify);

module.exports = router;