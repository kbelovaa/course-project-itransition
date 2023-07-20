const {Like} = require('../models/models');

class LikeController {
  async change(req, res) {
    const {userId, itemId} = req.body;
    const like = await Like.findOne({ where: {userId, itemId} });
    if (!like) {
      await Like.create({userId, itemId});
    } else {
      await Like.destroy({where: {userId, itemId}});
    }
    return res.status(200).json(like);
  }

  async getAll(req, res) {
    const {id} = req.params;
    const likes = await Like.findAndCountAll({ where: {itemId: id} });
    return res.status(200).json(likes.count);
  }

  async getOne(req, res) {
    const {userId, itemId} = req.query;
    const like = await Like.findOne({ where: {userId, itemId} });
    return res.status(200).json(like);
  };
}

module.exports = new LikeController();
