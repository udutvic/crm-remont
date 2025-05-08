const Order = require('../models/Order');
const Device = require('../models/Device');
const Client = require('../models/Client');
const { Op } = require('sequelize');
exports.getAllOrders = async (req, res) => {
  try {
    const where = {};
    if (req.query.status) where.status = req.query.status;
    if (req.query.startDate && req.query.endDate) {
      where.createdAt = { [Op.between]: [req.query.startDate, req.query.endDate] };
    }
    const orders = await Order.findAll({
      where,
      include: [
        { model: Device, as: 'device' },
        { model: Client, as: 'client' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Device, as: 'device' },
        { model: Client, as: 'client' }
      ]
    });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createOrder = async (req, res) => {
  try {
    console.log('CREATE ORDER BODY:', req.body);
    const { clientId, deviceId, problem, status, price } = req.body;
    if (!clientId || !deviceId || !problem || !status || price === undefined) {
      return res.status(400).json({ error: 'Потрібні всі поля: clientId, deviceId, problem, status, price.' });
    }
    const order = await Order.create({
      clientId,
      deviceId,
      problem,
      status,
      price: typeof price === 'string' ? parseFloat(price) : price
    });
    res.status(201).json(order);
  } catch (err) {
    console.error('CREATE ORDER ERROR:', err);
    res.status(500).json({ error: err.message });
  }
};
exports.updateOrder = async (req, res) => {
  try {
    const [updated] = await Order.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    const order = await Order.findByPk(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [updated] = await Order.update({ status }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    const order = await Order.findByPk(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteOrder = async (req, res) => {
  try {
    const deleted = await Order.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.searchOrders = async (req, res) => {
  try {
    const { q } = req.query;
    const orders = await Order.findAll({
      where: {
        [Op.or]: [
          { problem: { [Op.iLike]: `%${q}%` } },
        ]
      },
      include: [
        { model: Device, as: 'device' },
        { model: Client, as: 'client' }
      ]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
