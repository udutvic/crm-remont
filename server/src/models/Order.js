const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Device = require('./Device');
const Client = require('./Client');
const Order = sequelize.define('Order', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'clients', key: 'id' } },
  deviceId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'devices', key: 'id' } },
  problem: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'), allowNull: false, defaultValue: 'pending' },
  price: { type: DataTypes.FLOAT, allowNull: true },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW }
}, {
  tableName: 'orders',
  timestamps: true
});
Order.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
Order.belongsTo(Device, { foreignKey: 'deviceId', as: 'device' });
Client.hasMany(Order, { foreignKey: 'clientId', as: 'orders' });
Device.hasMany(Order, { foreignKey: 'deviceId', as: 'orders' });
module.exports = Order;
