const {Comment, User} = require('../models/models');
const ApiError = require('../error/ApiError');

class CommentController {
  async create(reqBody) {
    try {
      const {text, userId, itemId} = reqBody;
      const comment = await Comment.create({text, userId, itemId});
      const result = await Comment.findOne({ where: {id: comment.id}, include: User });
      return result;
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    const {itemId} = req.params;
    const comments = await Comment.findAll({ where: { itemId }, include: User, order: [['id', 'DESC']] });
    return res.status(200).json(comments);
  }

  async delete(reqParams) {
    const {id} = reqParams;
    const result = await Comment.destroy({where: {id}});
    return id;
  }
}

module.exports = new CommentController();
