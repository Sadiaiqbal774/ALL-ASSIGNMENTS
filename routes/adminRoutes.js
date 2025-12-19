const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Admin Dashboard
router.get('/', (req, res) => {
    res.render('admin/dashboard');
});

// Show All Products
router.get('/products', async (req, res) => {
    const products = await Product.find();
    res.render('admin/products', { products });
});

// Add Product Form
router.get('/products/add', (req, res) => {
    res.render('admin/productForm', { product: {} });
});

// Add Product POST
router.post('/products/add', async (req, res) => {
    const { name, price, category, image, description } = req.body;
    await Product.create({ name, price, category, image, description });
    res.redirect('/admin/products');
});

// Edit Product Form
router.get('/products/edit/:id', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.render('admin/productForm', { product });
});

// Edit Product POST
router.post('/products/edit/:id', async (req, res) => {
    const { name, price, category, image, description } = req.body;
    await Product.findByIdAndUpdate(req.params.id, {
        name, price, category, image, description
    });
    res.redirect('/admin/products');
});

// Delete Product
router.get('/products/delete/:id', async (req, res) => {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/products');
});

module.exports = router;
