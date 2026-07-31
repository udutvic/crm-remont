const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Client = require('./Client');
const Device = sequelize.define('Device', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'clients', key: 'id' } },
  brand: { type: DataTypes.STRING, allowNull: false },
  model: { type: DataTypes.STRING, allowNull: false },
  serial: { type: DataTypes.STRING, allowNull: true }
}, {
  tableName: 'devices',
  timestamps: true
});
Device.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Client.hasMany(Device, { foreignKey: 'clientId', as: 'devices' });
module.exports = Device;
