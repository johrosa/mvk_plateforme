const express = require('express');
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret';

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Aucun jeton' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Jeton invalide' });
  }
};

router.post('/', authenticate, async (req, res) => {
  if (req.user.role !== 'FARMER' && req.user.role !== 'HUB') {
    return res.status(403).json({ error: 'Non autorisé' });
  }
  try {
    const { name, description, price, unit, quantity, sourceFarmerName, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: parseFloat(price) || 0,
        unit: unit || "kg",
        quantity: parseInt(quantity) || 0,
        imageUrl: imageUrl || "",
        sourceFarmerName: req.user.role === 'HUB' ? sourceFarmerName : null,
        farmerId: req.user.userId,
      },
    });
    res.status(201).json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(400).json({ error: 'Échec de la création du produit', details: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const products = await prisma.product.findMany({
      include: { farmer: { select: { name: true, latitude: true, longitude: true } } }
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des produits' });
  }
});

module.exports = router;
