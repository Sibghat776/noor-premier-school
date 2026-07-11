const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Notice = sequelize.define('Notice', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING(200), allowNull: false, validate: { len: [1, 200] } },
  description: { type: DataTypes.TEXT, allowNull: false },
  noticeDate: { type: DataTypes.DATEONLY, allowNull: false },
});

module.exports = Notice;
