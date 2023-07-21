const { User } = require('../models/models');

class UserController {
  async getAll(req, res) {
    let { page, limit } = req.query;
    page = page || 1;
    limit = limit || 10;
    const offset = page * limit - limit;
    const users = await User.findAndCountAll({ order: ['id'], limit, offset });
    return res.status(200).json(users);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    return res.status(200).json(user);
  }

  async changeStatus(req, res) {
    const { id, status } = req.body;
    const result = await User.update({ status }, { where: { id } });
    return res.status(200).json(result);
  }

  async assignRights(req, res) {
    const { id, role } = req.body;
    const result = await User.update({ role }, { where: { id } });
    return res.status(200).json(result);
  }

  async delete(req, res) {
    const { id } = req.params;
    const result = await User.destroy({ where: { id } });
    return res.status(200).json(result);
  }
}

module.exports = new UserController();
