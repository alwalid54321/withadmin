const { logger } = require('../config/db');

// Validate product data
const validateProduct = (req, res, next) => {
  const { name, fob_sdpzu, cnf_aejea, cnf_inach1, cnf_cnahk, cnf_trmer, current_price } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Product name is required' });
  }

  // Validate all prices are numbers and non-negative
  const prices = [fob_sdpzu, cnf_aejea, cnf_inach1, cnf_cnahk, cnf_trmer, current_price];
  for (const price of prices) {
    if (price !== undefined && (isNaN(price) || price < 0)) {
      return res.status(400).json({ message: 'All prices must be non-negative numbers' });
    }
  }

  next();
};

// Validate currency data
const validateCurrency = (req, res, next) => {
  const { name, unit, central_bank, parallel_market } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Currency name is required' });
  }

  if (!unit || unit.trim().length === 0) {
    return res.status(400).json({ message: 'Currency unit is required' });
  }

  if (isNaN(central_bank) || central_bank < 0) {
    return res.status(400).json({ message: 'Central bank rate must be a non-negative number' });
  }

  if (isNaN(parallel_market) || parallel_market < 0) {
    return res.status(400).json({ message: 'Parallel market rate must be a non-negative number' });
  }

  next();
};

// Validate order data
const validateOrder = (req, res, next) => {
  const { tracking_number, status } = req.body;

  if (!tracking_number || tracking_number.trim().length === 0) {
    return res.status(400).json({ message: 'Tracking number is required' });
  }

  if (status && !['pending', 'processing', 'shipped', 'delivered'].includes(status)) {
    return res.status(400).json({ 
      message: 'Invalid status. Must be one of: pending, processing, shipped, delivered' 
    });
  }

  next();
};

// Rate limiting middleware
const rateLimit = (limit, windowMs) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old requests
    requests.forEach((timestamp, key) => {
      if (timestamp < windowStart) {
        requests.delete(key);
      }
    });

    // Get requests in current window
    const requestCount = (requests.get(ip) || [])
      .filter(timestamp => timestamp > windowStart)
      .length;

    if (requestCount >= limit) {
      logger.warn(`Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({ 
        message: 'Too many requests, please try again later' 
      });
    }

    // Add current request
    const timestamps = requests.get(ip) || [];
    timestamps.push(now);
    requests.set(ip, timestamps);

    next();
  };
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors
    });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      message: 'Unauthorized Access'
    });
  }

  res.status(500).json({
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });

  next();
};

module.exports = {
  validateProduct,
  validateCurrency,
  validateOrder,
  rateLimit,
  errorHandler,
  requestLogger
};
