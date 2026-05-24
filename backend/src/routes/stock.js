const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

const isStockManager = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Aucun jeton' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'STOCK_MANAGER' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès réservé aux gestionnaires de stock' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Jeton invalide' });
  }
};

router.get('/my-storages', isStockManager, async (req, res) => {
  const storages = await prisma.storage.findMany({
    include: { records: { include: { product: true } } }
  });
  res.json(storages);
});

router.post('/records', isStockManager, async (req, res) => {
  try {
    const { storageId, productId, quantity } = req.body;
    const record = await prisma.storageRecord.create({
      data: { storageId, productId, quantity, entryDate: new Date() }
    });

    await prisma.storage.update({
      where: { id: storageId },
      data: { currentLoad: { increment: quantity } }
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: 'Échec de l\'enregistrement de stock' });
  }
});

module.exports = router;
