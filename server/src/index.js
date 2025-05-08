require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const app = express();
const PORT = process.env.PORT || 5000;
const allowedOrigins = [
  'https://https://crm-repair-node.onrender.com/api',
  'https://localhost:5000',
 
];
app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
}));
app.use(express.json());
app.get('/', (req, res) => {
  res.json({ message: 'CRM Remont API is running!' });
});
app.use('/api/clients', require('./routes/clientRoutes'));
app.use('/api/devices', require('./routes/deviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));
(async () => {
  try {
    await db.authenticate();
    console.log('✅ Database connected...');
    await db.sync(); 
    console.log('✅ Database synchronized...');
    app.listen(PORT, () => {
      console.log(`🚀 Server started on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Unable to connect to the database:', err.message);
    process.exit(1); 
  }
})();
