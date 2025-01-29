const express = require('express');
const router = express.Router();
const { query, logger } = require('../config/db');

// Get all currencies
router.get('/', async (req, res) => {
  try {
    const currencies = await query('SELECT * FROM currencies ORDER BY name');
    res.json(currencies);
  } catch (error) {
    logger.error('Error fetching currencies:', error);
    res.status(500).json({ message: 'Error fetching currencies' });
  }
});

// Get currency by ID
router.get('/:id', async (req, res) => {
  try {
    const [currency] = await query('SELECT * FROM currencies WHERE id = ?', [req.params.id]);
    if (!currency) {
      return res.status(404).json({ message: 'Currency not found' });
    }
    res.json(currency);
  } catch (error) {
    logger.error('Error fetching currency:', error);
    res.status(500).json({ message: 'Error fetching currency' });
  }
});

// Update currency rates
router.put('/:id', async (req, res) => {
  const { central_bank, parallel_market } = req.body;

  try {
    // Get current rates to determine indicator
    const [currentRates] = await query(
      'SELECT central_bank, parallel_market FROM currencies WHERE id = ?',
      [req.params.id]
    );

    // Calculate indicators
    const centralBankIndicator = central_bank > currentRates.central_bank ? 'up' : 'down';
    const parallelIndicator = parallel_market > currentRates.parallel_market ? 'up' : 'down';

    // Update rates and indicators
    await query(`
      UPDATE currencies 
      SET central_bank = ?,
          parallel_market = ?,
          indicator = ?
      WHERE id = ?
    `, [
      central_bank,
      parallel_market,
      centralBankIndicator, // Using central bank indicator as main indicator
      req.params.id
    ]);

    res.json({ 
      message: 'Currency rates updated successfully',
      indicators: {
        central_bank: centralBankIndicator,
        parallel_market: parallelIndicator
      }
    });
  } catch (error) {
    logger.error('Error updating currency rates:', error);
    res.status(500).json({ message: 'Error updating currency rates' });
  }
});

// Add new currency
router.post('/', async (req, res) => {
  const { 
    name, 
    unit, 
    central_bank, 
    parallel_market,
    flag_url 
  } = req.body;

  try {
    const result = await query(`
      INSERT INTO currencies (
        name, unit, central_bank, parallel_market, 
        indicator, flag_url
      ) VALUES (?, ?, ?, ?, 'up', ?)
    `, [name, unit, central_bank, parallel_market, flag_url]);

    res.status(201).json({ 
      message: 'Currency added successfully',
      currencyId: result.insertId 
    });
  } catch (error) {
    logger.error('Error adding currency:', error);
    res.status(500).json({ message: 'Error adding currency' });
  }
});

// Delete currency
router.delete('/:id', async (req, res) => {
  try {
    await query('DELETE FROM currencies WHERE id = ?', [req.params.id]);
    res.json({ message: 'Currency deleted successfully' });
  } catch (error) {
    logger.error('Error deleting currency:', error);
    res.status(500).json({ message: 'Error deleting currency' });
  }
});

// Get exchange rates for specific currency
router.get('/:id/rates', async (req, res) => {
  try {
    const [rates] = await query(`
      SELECT 
        central_bank,
        parallel_market,
        indicator,
        updated_at as last_update
      FROM currencies 
      WHERE id = ?
    `, [req.params.id]);

    if (!rates) {
      return res.status(404).json({ message: 'Currency rates not found' });
    }

    res.json(rates);
  } catch (error) {
    logger.error('Error fetching currency rates:', error);
    res.status(500).json({ message: 'Error fetching currency rates' });
  }
});

module.exports = router;
