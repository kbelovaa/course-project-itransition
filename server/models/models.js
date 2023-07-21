const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: 'USER', allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'active', allowNull: false },
});

const Collection = sequelize.define('collection', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: false },
  theme: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING },
  numberField1: { type: DataTypes.STRING },
  numberField2: { type: DataTypes.STRING },
  numberField3: { type: DataTypes.STRING },
  stringField1: { type: DataTypes.STRING },
  stringField2: { type: DataTypes.STRING },
  stringField3: { type: DataTypes.STRING },
  textField1: { type: DataTypes.STRING },
  textField2: { type: DataTypes.STRING },
  textField3: { type: DataTypes.STRING },
  booleanField1: { type: DataTypes.STRING },
  booleanField2: { type: DataTypes.STRING },
  booleanField3: { type: DataTypes.STRING },
  dateField1: { type: DataTypes.STRING },
  dateField2: { type: DataTypes.STRING },
  dateField3: { type: DataTypes.STRING },
});

const Item = sequelize.define('item', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  numberField1: { type: DataTypes.INTEGER },
  numberField2: { type: DataTypes.INTEGER },
  numberField3: { type: DataTypes.INTEGER },
  stringField1: { type: DataTypes.STRING },
  stringField2: { type: DataTypes.STRING },
  stringField3: { type: DataTypes.STRING },
  textField1: { type: DataTypes.TEXT },
  textField2: { type: DataTypes.TEXT },
  textField3: { type: DataTypes.TEXT },
  booleanField1: { type: DataTypes.BOOLEAN },
  booleanField2: { type: DataTypes.BOOLEAN },
  booleanField3: { type: DataTypes.BOOLEAN },
  dateField1: { type: DataTypes.DATE },
  dateField2: { type: DataTypes.DATE },
  dateField3: { type: DataTypes.DATE },
});

const Tag = sequelize.define('tag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const ItemTag = sequelize.define('itemTag', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false },
});

const Like = sequelize.define('like', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

User.hasMany(Collection);
Collection.belongsTo(User);

Collection.hasMany(Item);
Item.belongsTo(Collection);

Tag.belongsToMany(Item, { through: ItemTag });
Item.belongsToMany(Tag, { through: ItemTag });

User.hasMany(Comment);
Comment.belongsTo(User);

Item.hasMany(Comment);
Comment.belongsTo(Item);

User.hasMany(Like);
Like.belongsTo(User);

Item.hasMany(Like);
Like.belongsTo(Item);

module.exports = {
  User,
  Collection,
  Item,
  Tag,
  ItemTag,
  Comment,
  Like,
};
