const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all products with latest prices
router.get('/products', async (req, res) => {
    try {
        const [products] = await db.query(
            `SELECT * FROM products 
             ORDER BY last_updated DESC`
        );
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all currencies with exchange rates
router.get('/currencies', async (req, res) => {
    try {
        const [currencies] = await db.query(
            `SELECT * FROM currencies 
             ORDER BY code ASC`
        );
        res.json(currencies);
    } catch (error) {
        console.error('Error fetching currencies:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get latest market statistics
router.get('/market-stats', async (req, res) => {
    try {
        // Get total number of products
        const [productCount] = await db.query(
            'SELECT COUNT(*) as count FROM products'
        );

        // Get average demand level
        const [avgDemand] = await db.query(
            'SELECT AVG(demand_level) as avg FROM products'
        );

        // Get trending products (high demand and upward trend)
        const [trendingProducts] = await db.query(
            `SELECT * FROM products 
             WHERE demand_level > 70 
             AND forecast_trend = 'up' 
             LIMIT 5`
        );

        res.json({
            productCount: productCount[0].count,
            averageDemand: avgDemand[0].avg,
            trendingProducts
        });
    } catch (error) {
        console.error('Error fetching market stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
