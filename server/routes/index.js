const express = require('express');

const router = express.Router();
const authRouter = require('./authRouter');
const userRouter = require('./userRouter');
const collectionRouter = require('./collectionRouter');
const itemRouter = require('./itemRouter');
const tagRouter = require('./tagRouter');
const likeRouter = require('./likeRouter');

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/collection', collectionRouter);
router.use('/item', itemRouter);
router.use('/tag', tagRouter);
router.use('/like', likeRouter);

module.exports = router;
