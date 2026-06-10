/**
 * Seeds the product catalog.
 *
 *   npm run seed          # wipe products, then insert the sample catalog
 *
 * Images are served from the frontend's /public/products folder, so the
 * stored paths resolve directly in the browser without bundling.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const products = [
  {
    name: 'WILD Botanical Serum',
    image: '/products/product-serum.png',
    description:
      'A lightweight facial serum pressed from cold-extracted botanicals to nourish, hydrate, and restore a natural glow.',
    brand: 'WILD Natural',
    category: 'Serum',
    price: 48,
    countInStock: 12,
  },
  {
    name: 'WILD Renewal Cream',
    image: '/products/product-cream.png',
    description:
      'A rich whipped moisturizer with shea and rosehip that softens, plumps, and seals in overnight hydration.',
    brand: 'WILD Natural',
    category: 'Moisturizer',
    price: 54,
    countInStock: 8,
  },
  {
    name: 'WILD Gentle Cleanser',
    image: '/products/product-cleanser.png',
    description:
      'A sulfate-free gel cleanser that lifts impurities and makeup while leaving the skin barrier calm and balanced.',
    brand: 'WILD Natural',
    category: 'Cleanser',
    price: 32,
    countInStock: 20,
  },
  {
    name: 'WILD Radiance Oil',
    image: '/products/product-serum.png',
    description:
      'A fast-absorbing face oil blended with jojoba and squalane to revive dull, tired skin with a dewy finish.',
    brand: 'WILD Natural',
    category: 'Serum',
    price: 44,
    countInStock: 5,
  },
  {
    name: 'WILD Night Balm',
    image: '/products/product-cream.png',
    description:
      'A deeply restorative night balm that works while you sleep to smooth texture and replenish moisture.',
    brand: 'WILD Natural',
    category: 'Moisturizer',
    price: 58,
    countInStock: 0,
  },
  {
    name: 'WILD Clay Cleanser',
    image: '/products/product-cleanser.png',
    description:
      'A purifying clay-based wash that draws out excess oil and refines pores without stripping the skin.',
    brand: 'WILD Natural',
    category: 'Cleanser',
    price: 36,
    countInStock: 15,
  },
];

async function seed() {
  if (!process.env.MONGO_URI) {
    console.error('Missing MONGO_URI in environment.');
    process.exit(1);
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Connected: ${conn.connection.host} / ${conn.connection.name}`);

    const removed = await Product.deleteMany({});
    console.log(`Removed ${removed.deletedCount} existing product(s).`);

    const created = await Product.insertMany(products);
    console.log(`Inserted ${created.length} product(s).`);

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
}

seed();
