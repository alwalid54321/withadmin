const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// Get all products
router.get('/products', auth, async (req, res) => {
    try {
        const [products] = await db.query(
            'SELECT * FROM products ORDER BY last_updated DESC'
        );
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Add new product
router.post('/products', auth, async (req, res) => {
    try {
        const {
            name,
            base_currency,
            port_sudan_price,
            dmt_china_price,
            dmt_uae_price,
            dmt_mersing_price,
            dmt_india_price,
            demand_level,
            status,
            forecast_trend
        } = req.body;

        const [result] = await db.query(
            `INSERT INTO products (
                name, base_currency, port_sudan_price, dmt_china_price,
                dmt_uae_price, dmt_mersing_price, dmt_india_price,
                demand_level, status, forecast_trend
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                name, base_currency, port_sudan_price, dmt_china_price,
                dmt_uae_price, dmt_mersing_price, dmt_india_price,
                demand_level, status, forecast_trend
            ]
        );

        res.json({ 
            message: 'Product added successfully',
            productId: result.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update product
router.put('/products/:id', auth, async (req, res) => {
    try {
        const {
            name,
            base_currency,
            port_sudan_price,
            dmt_china_price,
            dmt_uae_price,
            dmt_mersing_price,
            dmt_india_price,
            demand_level,
            status,
            forecast_trend
        } = req.body;

        await db.query(
            `UPDATE products SET
                name = ?, base_currency = ?, port_sudan_price = ?,
                dmt_china_price = ?, dmt_uae_price = ?, dmt_mersing_price = ?,
                dmt_india_price = ?, demand_level = ?, status = ?,
                forecast_trend = ?, last_updated = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [
                name, base_currency, port_sudan_price, dmt_china_price,
                dmt_uae_price, dmt_mersing_price, dmt_india_price,
                demand_level, status, forecast_trend, req.params.id
            ]
        );

        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete product
router.delete('/products/:id', auth, async (req, res) => {
    try {
        await db.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all currencies
router.get('/currencies', auth, async (req, res) => {
    try {
        const [currencies] = await db.query(
            'SELECT * FROM currencies ORDER BY code'
        );
        res.json(currencies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update currency rates
router.put('/currencies/:code', auth, async (req, res) => {
    try {
        const { rate_to_usd } = req.body;
        await db.query(
            'UPDATE currencies SET rate_to_usd = ?, last_updated = CURRENT_TIMESTAMP WHERE code = ?',
            [rate_to_usd, req.params.code]
        );
        res.json({ message: 'Currency rate updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get dashboard stats
router.get('/stats', auth, async (req, res) => {
    try {
        // Get product count
        const [productCount] = await db.query(
            'SELECT COUNT(*) as count FROM products'
        );

        // Get recent updates
        const [recentUpdates] = await db.query(
            `SELECT id, name, port_sudan_price, dmt_uae_price, status, last_updated 
             FROM products 
             ORDER BY last_updated DESC 
             LIMIT 5`
        );

        // Get currencies
        const [currencies] = await db.query(
            'SELECT code, rate_to_usd, flag_url, last_updated FROM currencies'
        );

        res.json({
            productCount: productCount[0].count,
            recentUpdates,
            currencies
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
