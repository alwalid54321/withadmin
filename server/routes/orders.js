const express = require('express');
const router = express.Router();
const { query, logger } = require('../config/db');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await query(`
      SELECT 
        id,
        tracking_number,
        status,
        created_at,
        updated_at
      FROM orders
      ORDER BY created_at DESC
    `);
    res.json(orders);
  } catch (error) {
    logger.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Track order by tracking number
router.get('/track/:tracking_number', async (req, res) => {
  try {
    const [order] = await query(
      'SELECT * FROM orders WHERE tracking_number = ?',
      [req.params.tracking_number]
    );

    if (!order) {
      return res.status(404).json({ 
        message: 'Order not found',
        tracking_number: req.params.tracking_number
      });
    }

    res.json({
      tracking_number: order.tracking_number,
      status: order.status,
      created_at: order.created_at,
      last_update: order.updated_at,
      timeline: [
        {
          status: 'Order Created',
          date: order.created_at
        },
        ...(order.status !== 'pending' ? [{
          status: 'Processing',
          date: order.processing_date
        }] : []),
        ...(order.status === 'shipped' || order.status === 'delivered' ? [{
          status: 'Shipped',
          date: order.shipping_date
        }] : []),
        ...(order.status === 'delivered' ? [{
          status: 'Delivered',
          date: order.delivery_date
        }] : [])
      ]
    });
  } catch (error) {
    logger.error('Error tracking order:', error);
    res.status(500).json({ message: 'Error tracking order' });
  }
});

// Create new order
router.post('/', async (req, res) => {
  const { tracking_number, status = 'pending' } = req.body;

  try {
    // Check if tracking number already exists
    const [existingOrder] = await query(
      'SELECT id FROM orders WHERE tracking_number = ?',
      [tracking_number]
    );

    if (existingOrder) {
      return res.status(400).json({ 
        message: 'Tracking number already exists' 
      });
    }

    const result = await query(`
      INSERT INTO orders (tracking_number, status)
      VALUES (?, ?)
    `, [tracking_number, status]);

    res.status(201).json({
      message: 'Order created successfully',
      orderId: result.insertId,
      tracking_number
    });
  } catch (error) {
    logger.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update order status
router.put('/:tracking_number/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ 
      message: 'Invalid status. Must be one of: ' + validStatuses.join(', ') 
    });
  }

  try {
    // Get current order
    const [order] = await query(
      'SELECT * FROM orders WHERE tracking_number = ?',
      [req.params.tracking_number]
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status and corresponding date
    let updateQuery = 'UPDATE orders SET status = ? ';
    const params = [status];

    switch (status) {
      case 'processing':
        updateQuery += ', processing_date = CURRENT_TIMESTAMP ';
        break;
      case 'shipped':
        updateQuery += ', shipping_date = CURRENT_TIMESTAMP ';
        break;
      case 'delivered':
        updateQuery += ', delivery_date = CURRENT_TIMESTAMP ';
        break;
    }

    updateQuery += 'WHERE tracking_number = ?';
    params.push(req.params.tracking_number);

    await query(updateQuery, params);

    res.json({ 
      message: 'Order status updated successfully',
      tracking_number: req.params.tracking_number,
      new_status: status
    });
  } catch (error) {
    logger.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

// Delete order
router.delete('/:tracking_number', async (req, res) => {
  try {
    const result = await query(
      'DELETE FROM orders WHERE tracking_number = ?',
      [req.params.tracking_number]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ 
      message: 'Order deleted successfully',
      tracking_number: req.params.tracking_number
    });
  } catch (error) {
    logger.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

// Get order statistics
router.get('/statistics', async (req, res) => {
  try {
    const [stats] = await query(`
      SELECT
        COUNT(*) as total_orders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending_orders,
        SUM(CASE WHEN status = 'processing' THEN 1 ELSE 0 END) as processing_orders,
        SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END) as shipped_orders,
        SUM(CASE WHEN status = 'delivered' THEN 1 ELSE 0 END) as delivered_orders
      FROM orders
    `);

    res.json(stats);
  } catch (error) {
    logger.error('Error fetching order statistics:', error);
    res.status(500).json({ message: 'Error fetching order statistics' });
  }
});

module.exports = router;
