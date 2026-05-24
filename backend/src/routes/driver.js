const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

const isDriver = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Aucun jeton' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'DRIVER' && decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès réservé aux chauffeurs' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Jeton invalide' });
  }
};

router.get('/my-deliveries', isDriver, async (req, res) => {
  const deliveries = await prisma.delivery.findMany({
    where: req.user.role === 'ADMIN' ? {} : { driverId: req.user.userId },
    include: { order: { include: { product: true, buyer: true } }, transport: true }
  });
  res.json(deliveries);
});

router.put('/deliveries/:id/status', isDriver, async (req, res) => {
  try {
    const { status, currentLocation } = req.body;
    const delivery = await prisma.delivery.update({
      where: { id: parseInt(req.params.id) },
      data: {
        status,
        actualDate: status === 'DELIVERED' ? new Date() : undefined,
        transport: currentLocation ? { update: { currentLocation } } : undefined
      }
    });
    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: 'Échec de la mise à jour' });
  }
});

module.exports = router;
