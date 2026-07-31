const Client = require('../models/Client');
const Device = require('../models/Device');
const Order = require('../models/Order');
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll({ include: [{ model: Device, as: 'devices' }] });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, { include: [{ model: Device, as: 'devices' }] });
    if (!client) return res.status(404).json({ error: 'Client not found' });
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createClient = async (req, res) => {
  try {
    console.log('CREATE CLIENT BODY:', req.body);
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    console.error('CREATE CLIENT ERROR:', err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: 'Клієнт з таким телефоном або email вже існує.' });
    }
    res.status(500).json({ error: err.message });
  }
};
exports.updateClient = async (req, res) => {
  try {
    const [updated] = await Client.update(req.body, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Client not found' });
    const client = await Client.findByPk(req.params.id);
    res.json(client);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.deleteClient = async (req, res) => {
  try {
    const ordersCount = await Order.count({ where: { clientId: req.params.id } });
    if (ordersCount > 0) {
      return res.status(400).json({ error: 'Cannot delete client because there are open orders associated with this client.' });
    }
    const deleted = await Client.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.searchClients = async (req, res) => {
  try {
    const { q } = req.query;
    const clients = await Client.findAll({
      where: {
        name: { [require('sequelize').Op.iLike]: `%${q}%` }
      }
    });
    res.json(clients);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.removeClientDuplicates = async (req, res) => {
  try {
    const [resultsEmail] = await Client.sequelize.query(`
      DELETE FROM clients
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM clients
        GROUP BY email
      );
    `);
    const [resultsPhone] = await Client.sequelize.query(`
      DELETE FROM clients
      WHERE id NOT IN (
        SELECT MIN(id)
        FROM clients
        GROUP BY phone
      );
    `);
    res.json({ message: 'Дублікати email та phone видалено.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
