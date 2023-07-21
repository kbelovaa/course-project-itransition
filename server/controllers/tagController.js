const sequelize = require('../db');
const { Tag, ItemTag } = require('../models/models');

class TagController {
  async getPopular(req, res) {
    let { limit } = req.query;
    limit = limit || 30;
    const tagsCount = await ItemTag.findAll({
      attributes: ['tagId', [sequelize.fn('COUNT', sequelize.col('id')), 'tagCount']],
      group: ['tagId'],
      order: [['tagCount', 'DESC']],
      limit,
    });
    const tagsId = tagsCount.map((tag) => tag.tagId);
    const tags = await Tag.findAll({ where: { id: tagsId } });
    return res.status(200).json({ tagsCount, tags });
  }
}

module.exports = new TagController();
