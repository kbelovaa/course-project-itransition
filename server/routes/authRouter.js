const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/registration', authController.registration);
router.post('/login', authController.login);
router.get('/auth', authMiddleware, authController.check);

module.exports = router;
