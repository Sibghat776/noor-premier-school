const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admission = sequelize.define('Admission', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  studentName: { type: DataTypes.STRING(100), allowNull: false },
  fatherName: { type: DataTypes.STRING(100), allowNull: false },
  cnicOrBForm: { type: DataTypes.STRING(20), allowNull: false },
  classApplying: { type: DataTypes.STRING(50), allowNull: false },
  contactNumber: { type: DataTypes.STRING(15), allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, validate: { isEmail: true } },
  address: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'reviewed'), defaultValue: 'pending' },
});

module.exports = Admission;
