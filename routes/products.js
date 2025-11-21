const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products'
    });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error fetching product'
    });
  }
});

// Add sample products (for testing - remove in production)
router.post('/sample', async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Wireless Bluetooth Headphones",
        description: "High-quality wireless headphones with active noise cancellation. Perfect for music lovers and professionals who need focus.",
        price: 99.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
        category: "Electronics",
        stock: 50
      },
      {
        name: "Smart Fitness Watch",
        description: "Advanced smartwatch with heart rate monitoring, GPS, and 7-day battery life. Track your workouts and stay connected.",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
        category: "Electronics",
        stock: 30
      },
      {
        name: "Professional Running Shoes",
        description: "Lightweight running shoes with superior cushioning and support. Designed for marathon runners and daily joggers.",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
        category: "Sports",
        stock: 100
      },
      {
        name: "Organic Cotton T-Shirt",
        description: "Comfortable and sustainable organic cotton t-shirt. Available in multiple colors and sizes for everyday wear.",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
        category: "Clothing",
        stock: 200
      },
      {
        name: "Programming Fundamentals Book",
        description: "Comprehensive guide to programming fundamentals. Perfect for beginners starting their coding journey.",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&h=500&fit=crop",
        category: "Books",
        stock: 75
      },
      {
        name: "Stainless Steel Water Bottle",
        description: "Eco-friendly stainless steel water bottle that keeps drinks cold for 24 hours or hot for 12 hours.",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop",
        category: "Home",
        stock: 150
      }
    ];

    // Clear existing products and add new ones
    await Product.deleteMany({});
    const products = await Product.insertMany(sampleProducts);

    res.json({
      success: true,
      message: 'Sample products added successfully',
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Add sample products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding sample products'
    });
  }
});

module.exports = router;