const express = require('express');
const userController = require('../controllers/userController');
const checkRoleMiddleware = require('../middleware/checkRoleMiddleware');

const router = express.Router();

router.get('/all', checkRoleMiddleware('ADMIN'), userController.getAll);
router.get('/:id', userController.getOne);
router.patch('/status', checkRoleMiddleware('ADMIN'), userController.changeStatus);
router.patch('/rights', checkRoleMiddleware('ADMIN'), userController.assignRights);
router.delete('/delete/:id', checkRoleMiddleware('ADMIN'), userController.delete);

module.exports = router;
