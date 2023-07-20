const express = require('express');
const collectionController = require('../controllers/collectionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/all', collectionController.getAllForUser);
router.get('/largest', collectionController.getLargest);
router.get('/:id', collectionController.getOne);
router.post('/create', authMiddleware, collectionController.create);
router.patch('/edit/:id', authMiddleware, collectionController.edit);
router.delete('/delete/:id', collectionController.delete);

module.exports = router;
