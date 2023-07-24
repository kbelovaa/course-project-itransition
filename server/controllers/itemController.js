const { Item, Tag, ItemTag, Collection, User, Like, Comment } = require('../models/models');
const ApiError = require('../error/ApiError');

class ItemController {
  async create(req, res, next) {
    try {
      let { name, customFields, tags, collectionId } = req.body;
      customFields = JSON.parse(customFields);
      tags = JSON.parse(tags);
      const [
        numberField1,
        numberField2,
        numberField3,
        stringField1,
        stringField2,
        stringField3,
        textField1,
        textField2,
        textField3,
        booleanField1,
        booleanField2,
        booleanField3,
        dateField1,
        dateField2,
        dateField3,
      ] = customFields.map((item) => (item === '' ? null : item));
      const item = await Item.create({
        name,
        numberField1,
        numberField2,
        numberField3,
        stringField1,
        stringField2,
        stringField3,
        textField1,
        textField2,
        textField3,
        booleanField1,
        booleanField2,
        booleanField3,
        dateField1,
        dateField2,
        dateField3,
        collectionId,
      });
      tags.forEach((tag) => {
        Tag.findOrCreate({ where: { name: tag } })
          .then(() => Tag.findOne({ where: { name: tag } }))
          .then((dbTag) =>
            ItemTag.findOrCreate({
              where: { tagId: dbTag.id, itemId: item.id },
            })
          );
      });
      return res.status(200).json(item);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    const result1 = await Comment.destroy({ where: { itemId: id } });
    const result2 = await Like.destroy({ where: { itemId: id } });
    const result = await Item.destroy({ where: { id } });
    return res.status(200).json(result);
  }

  async getAllForCollection(req, res) {
    const { collectionId } = req.query;
    const items = await Item.findAll({
      where: { collectionId },
      order: ['id'],
      include: Tag,
    });
    return res.status(200).json(items);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const item = await Item.findOne({ where: { id } });
    const tags = await item.getTags({ order: ['id'] });
    return res.status(200).json({ item, tags });
  }

  async getByTag(req, res) {
    const { tagId } = req.query;
    const tag = await Tag.findOne({ where: { id: tagId } });
    const itemTags = await ItemTag.findAll({ where: { tagId } });
    const itemsId = itemTags.map((item) => item.itemId);
    const items = await Item.findAll({
      include: { model: Collection, include: User },
      order: [['id', 'DESC']],
      where: { id: itemsId },
    });
    return res.status(200).json({ items, tag });
  }

  async edit(req, res) {
    let { name, customFields, tags } = req.body;
    customFields = JSON.parse(customFields);
    tags = JSON.parse(tags);
    const { id } = req.params;
    const [
      numberField1,
      numberField2,
      numberField3,
      stringField1,
      stringField2,
      stringField3,
      textField1,
      textField2,
      textField3,
      booleanField1,
      booleanField2,
      booleanField3,
      dateField1,
      dateField2,
      dateField3,
    ] = customFields.map((item) => (item === '' ? null : item));
    const result = await Item.update(
      {
        name,
        numberField1,
        numberField2,
        numberField3,
        stringField1,
        stringField2,
        stringField3,
        textField1,
        textField2,
        textField3,
        booleanField1,
        booleanField2,
        booleanField3,
        dateField1,
        dateField2,
        dateField3,
      },
      { where: { id } }
    );
    await ItemTag.destroy({ where: { itemId: id } }).then(() =>
      tags.forEach((tag) => {
        Tag.findOrCreate({ where: { name: tag } })
          .then(() => Tag.findOne({ where: { name: tag } }))
          .then((dbTag) => ItemTag.findOrCreate({ where: { tagId: dbTag.id, itemId: id } }));
      })
    );
    return res.status(200).json(result);
  }

  async getLatest(req, res) {
    let { limit } = req.query;
    limit = limit || 5;
    const items = await Item.findAll({
      include: { model: Collection, include: User },
      order: [['id', 'DESC']],
      limit,
    });
    return res.status(200).json(items);
  }
}

module.exports = new ItemController();
