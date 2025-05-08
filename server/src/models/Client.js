const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = sequelize.define('Client', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true }
}, {
  tableName: 'clients',
  timestamps: true
});
module.exports = Client;
