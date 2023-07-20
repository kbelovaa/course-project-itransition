const express = require('express');
const tagController = require('../controllers/tagController');

const router = express.Router();

router.get('/popular', tagController.getPopular);

module.exports = router;
