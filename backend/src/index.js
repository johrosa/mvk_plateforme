require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');
const driverRoutes = require('./routes/driver');
const stockRoutes = require('./routes/stock');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/driver', driverRoutes);
app.use('/api/stock', stockRoutes);

app.get('/', (req, res) => res.send('API running'));

if (!process.env.JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET not set in environment variables');
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
