const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {
  async comparePassword(password) {
    const bcrypt = require('bcryptjs');
    return bcrypt.compare(password, this.passwordHash);
  }
}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING(320), allowNull: false, unique: true, validate: { isEmail: true } },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  defaultScope: { attributes: { exclude: ['passwordHash'] } },
  scopes: { withPassword: { attributes: {} } },
});

class Note extends Model {}

Note.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
  summary: { type: DataTypes.TEXT, allowNull: true },
  tags: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: false, defaultValue: [] },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
    onDelete: 'CASCADE',
  },
}, {
  sequelize,
  modelName: 'Note',
  tableName: 'notes',
});

User.hasMany(Note, { foreignKey: 'userId', onDelete: 'CASCADE' });
Note.belongsTo(User, { foreignKey: 'userId' });

module.exports = { Note, User, sequelize };