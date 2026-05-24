const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

// Middleware to check if user is admin
const isAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Aucun jeton' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Jeton invalide' });
  }
};

// --- User Management ---

router.get('/users', isAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, name: true, role: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des utilisateurs' });
  }
});

router.put('/users/:id', isAdmin, async (req, res) => {
  try {
    const { name, role } = req.body;
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: { name, role }
    });
    res.json(user);
  } catch (error) {
    res.status(400).json({ error: 'Échec de la mise à jour' });
  }
});

// --- Logistics Management ---

// Transports
router.get('/transports', isAdmin, async (req, res) => {
  const transports = await prisma.transport.findMany();
  res.json(transports);
});

router.post('/transports', isAdmin, async (req, res) => {
  try {
    const transport = await prisma.transport.create({ data: req.body });
    res.status(201).json(transport);
  } catch (error) {
    res.status(400).json({ error: 'Échec de la création du transport' });
  }
});

// Storages
router.get('/storages', isAdmin, async (req, res) => {
  const storages = await prisma.storage.findMany({ include: { records: true } });
  res.json(storages);
});

router.post('/storages', isAdmin, async (req, res) => {
  try {
    const storage = await prisma.storage.create({ data: req.body });
    res.status(201).json(storage);
  } catch (error) {
    res.status(400).json({ error: 'Échec de la création de l\'entrepôt' });
  }
});

// Deliveries
router.get('/deliveries', isAdmin, async (req, res) => {
  const deliveries = await prisma.delivery.findMany({
    include: { order: true, transport: true, driver: { select: { name: true } } }
  });
  res.json(deliveries);
});

router.put('/deliveries/:id', isAdmin, async (req, res) => {
  try {
    const { status, transportId, driverId, estimatedDate } = req.body;
    const delivery = await prisma.delivery.update({
      where: { id: parseInt(req.params.id) },
      data: { status, transportId, driverId, estimatedDate: estimatedDate ? new Date(estimatedDate) : undefined }
    });
    res.json(delivery);
  } catch (error) {
    res.status(400).json({ error: 'Échec de la mise à jour de la livraison' });
  }
});

module.exports = router;
