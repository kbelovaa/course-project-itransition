const express = require('express');
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all/:id', likeController.getAll);
router.get('/one', authMiddleware, likeController.getOne);
router.patch('/', authMiddleware, likeController.change);

module.exports = router;
