const sequelize = require('../db');
const { Collection, Item, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class CollectionController {
  async create(req, res, next) {
    try {
      let { name, description, theme, img, customFields, userId } = req.body;
      customFields = JSON.parse(customFields);
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
      const collection = await Collection.create({
        name,
        description,
        theme,
        img,
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
        userId,
      });
      return res.status(200).json(collection);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res) {
    const { id } = req.params;
    const result2 = await Item.destroy({ where: { collectionId: id } });
    const result = await Collection.destroy({ where: { id } });
    return res.status(200).json(result);
  }

  async getAllForUser(req, res) {
    let { userId, page, limit } = req.query;
    page = page || 1;
    limit = limit || 10;
    const offset = page * limit - limit;
    const collections = await Collection.findAndCountAll({
      where: { userId },
      order: ['id'],
      limit,
      offset,
    });
    return res.status(200).json(collections);
  }

  async getOne(req, res) {
    const { id } = req.params;
    const collection = await Collection.findOne({ where: { id } });
    return res.status(200).json(collection);
  }

  async edit(req, res) {
    let { name, description, theme, img, customFields } = req.body;
    customFields = JSON.parse(customFields);
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
    const result = await Collection.update(
      {
        name,
        description,
        theme,
        img,
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
    return res.status(200).json(result);
  }

  async getLargest(req, res) {
    let { limit } = req.query;
    limit = limit || 5;
    const collections = await Item.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.col('item.id')), 'itemsCount']],
      group: ['collection.id'],
      order: [['itemsCount', 'DESC']],
      limit,
      include: Collection,
    });
    const usersId = collections.map((collection) => collection.collection.userId);
    const users = await User.findAll({ where: { id: usersId } });
    return res.status(200).json({ collections, users });
  }
}

module.exports = new CollectionController();
