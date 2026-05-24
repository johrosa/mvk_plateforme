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
  if (req.user.role !== 'RETAILER' && req.user.role !== 'SALES_REP') {
    return res.status(403).json({ error: 'Non autorisé' });
  }

  try {
    const { productId, quantity, retailerName, buyerId } = req.body;
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.quantity < quantity) {
      return res.status(400).json({ error: 'Produit non disponible ou quantité insuffisante' });
    }

    const total = product.price * quantity;

    // Déterminer qui passe la commande
    const orderData = {
      productId,
      quantity,
      total,
      status: 'PENDING',
      delivery: { create: { status: 'PENDING' } }
    };

    if (req.user.role === 'SALES_REP') {
      orderData.placedById = req.user.userId;
      orderData.retailerName = retailerName;
      if (buyerId) orderData.buyerId = buyerId;
    } else {
      orderData.buyerId = req.user.userId;
    }

    const order = await prisma.$transaction([
      prisma.order.create({ data: orderData }),
      prisma.product.update({
        where: { id: productId },
        data: { quantity: product.quantity - quantity },
      }),
    ]);
    res.status(201).json(order[0]);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Échec de la commande' });
  }
});

router.get('/', authenticate, async (req, res) => {
  try {
    let where = {};
    if (req.user.role === 'FARMER') {
      where = { product: { farmerId: req.user.userId } };
    } else if (req.user.role === 'SALES_REP') {
      where = { placedById: req.user.userId };
    } else if (req.user.role === 'ADMIN') {
      where = {}; // Admin voit tout
    } else {
      where = { buyerId: req.user.userId };
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        product: true,
        buyer: { select: { name: true } },
        placedBy: { select: { name: true } }
      }
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Échec de la récupération des commandes' });
  }
});

module.exports = router;
