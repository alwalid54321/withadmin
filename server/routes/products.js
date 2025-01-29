const express = require('express');
const router = express.Router();
const { query, logger } = require('../config/db');

// Get all products with prices
router.get('/', async (req, res) => {
  try {
    const products = await query(`
      SELECT p.*, 
             (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'value', ph.price,
                  'indicator', ph.indicator,
                  'date', ph.recorded_at
                )
             ) FROM price_history ph 
             WHERE ph.product_id = p.id 
             ORDER BY ph.recorded_at DESC 
             LIMIT 5) as price_history
      FROM products p
    `);
    res.json(products);
  } catch (error) {
    logger.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
});

// Get product by ID
router.get('/:id', async (req, res) => {
  try {
    const [product] = await query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    logger.error('Error fetching product:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
});

// Update product prices
router.put('/:id/prices', async (req, res) => {
  const { 
    fob_sdpzu, 
    cnf_aejea, 
    cnf_inach1, 
    cnf_cnahk, 
    cnf_trmer,
    current_price 
  } = req.body;

  try {
    // Start transaction
    await query('START TRANSACTION');

    // Update product prices
    await query(`
      UPDATE products 
      SET fob_sdpzu = ?, 
          cnf_aejea = ?, 
          cnf_inach1 = ?, 
          cnf_cnahk = ?, 
          cnf_trmer = ?,
          current_price = ?
      WHERE id = ?
    `, [fob_sdpzu, cnf_aejea, cnf_inach1, cnf_cnahk, cnf_trmer, current_price, req.params.id]);

    // Add to price history
    await query(`
      INSERT INTO price_history (product_id, price, indicator)
      VALUES (?, ?, ?)
    `, [
      req.params.id, 
      current_price,
      current_price > (SELECT current_price FROM products WHERE id = ?) ? 'up' : 'down'
    ]);

    // Commit transaction
    await query('COMMIT');

    res.json({ message: 'Prices updated successfully' });
  } catch (error) {
    // Rollback on error
    await query('ROLLBACK');
    logger.error('Error updating product prices:', error);
    res.status(500).json({ message: 'Error updating product prices' });
  }
});

// Add new product
router.post('/', async (req, res) => {
  const { 
    name, 
    fob_sdpzu, 
    cnf_aejea, 
    cnf_inach1, 
    cnf_cnahk, 
    cnf_trmer,
    current_price 
  } = req.body;

  try {
    const result = await query(`
      INSERT INTO products (
        name, fob_sdpzu, cnf_aejea, cnf_inach1, 
        cnf_cnahk, cnf_trmer, current_price
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [name, fob_sdpzu, cnf_aejea, cnf_inach1, cnf_cnahk, cnf_trmer, current_price]);

    res.status(201).json({ 
      message: 'Product added successfully',
      productId: result.insertId 
    });
  } catch (error) {
    logger.error('Error adding product:', error);
    res.status(500).json({ message: 'Error adding product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM price_history WHERE product_id = ?', [req.params.id]);
    await query('DELETE FROM products WHERE id = ?', [req.params.id]);
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    logger.error('Error deleting product:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
});

module.exports = router;
