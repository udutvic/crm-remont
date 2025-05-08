const Client = require('../models/Client');
const Device = require('../models/Device');
const Order = require('../models/Order');
exports.getDashboardStats = async (req, res) => {
  try {
    const clientCount = await Client.count();
    const deviceCount = await Device.count();
    const orderCount = await Order.count();
    const totalIncome = await Order.sum('price', { where: { status: 'completed' } });
    res.json({ clientCount, deviceCount, orderCount, totalIncome: totalIncome || 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
