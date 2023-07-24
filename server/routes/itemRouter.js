const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const itemController = require('../controllers/itemController');

const router = express.Router();

router.get('/all', itemController.getAllForCollection);
router.get('/latest', itemController.getLatest);
router.get('/bytag', itemController.getByTag);
router.get('/:id', itemController.getOne);
router.post('/create', authMiddleware, itemController.create);
router.patch('/edit/:id', authMiddleware, itemController.edit);
router.delete('/delete/:id', authMiddleware, itemController.delete);

module.exports = router;
