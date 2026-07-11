const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AdminUser = sequelize.define('AdminUser', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username: { type: DataTypes.STRING(20), allowNull: false, unique: true, validate: { len: [3, 20] } },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  passwordChanged: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = AdminUser;
