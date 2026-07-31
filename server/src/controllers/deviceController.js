const Device = require('../models/Device');
const Client = require('../models/Client');
const Order = require('../models/Order');
const { Op } = require('sequelize');
exports.getAllDevices = async (req, res) => {
  try {
    const where = {};
    if (req.query.clientId) where.clientId = req.query.clientId;
    const devices = await Device.findAll({ where, include: [{ model: Client, as: 'client' }] });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id, { include: [{ model: Client, as: 'client' }] });
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createDevice = async (req, res) => {
  try {
    const device = await Device.create(req.body);
    res.status(201).json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateDevice = async (req, res) => {
  try {
    const [updated] = await Device.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Device not found' });
    const device = await Device.findByPk(req.params.id);
    res.json(device);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteDevice = async (req, res) => {
  try {
    const ordersCount = await Order.count({ where: { deviceId: req.params.id } });
    if (ordersCount > 0) {
      return res.status(400).json({ error: 'Cannot delete device because there are open orders associated with this device.' });
    }
    const deleted = await Device.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Device not found' });
    res.json({ message: 'Device deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.searchDevices = async (req, res) => {
  try {
    const { q } = req.query;
    const devices = await Device.findAll({
      where: {
        [Op.or]: [
          { brand: { [Op.iLike]: `%${q}%` } },
          { model: { [Op.iLike]: `%${q}%` } },
          { serial: { [Op.iLike]: `%${q}%` } }
        ]
      }
    });
    res.json(devices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
