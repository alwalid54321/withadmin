const NodeCache = require('node-cache');
const { logger } = require('../config/db');

// Initialize cache with 5 minutes standard TTL
const cache = new NodeCache({ 
  stdTTL: 300,
  checkperiod: 320,
  useClones: false
});

// Cache middleware for API responses
const cacheMiddleware = (duration) => {
  return (req, res, next) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `__express__${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      logger.debug(`Cache hit for key: ${key}`);
      return res.json(cachedResponse);
    }

    // Store the original json method
    const originalJson = res.json;

    // Override json method
    res.json = function(body) {
      originalJson.call(this, body);
      
      // Store the response in cache
      try {
        cache.set(key, body, duration);
        logger.debug(`Cached response for key: ${key}`);
      } catch (error) {
        logger.error('Cache storage error:', error);
      }
    };

    next();
  };
};

// Clear cache for specific patterns
const clearCache = (pattern) => {
  const keys = cache.keys();
  const matchingKeys = pattern 
    ? keys.filter(key => key.includes(pattern))
    : keys;

  matchingKeys.forEach(key => cache.del(key));
  logger.info(`Cleared ${matchingKeys.length} cache entries`);
};

// Get cache statistics
const getCacheStats = () => {
  return {
    keys: cache.keys().length,
    hits: cache.getStats().hits,
    misses: cache.getStats().misses,
    ksize: cache.getStats().ksize,
    vsize: cache.getStats().vsize
  };
};

// Warm up cache with initial data
const warmupCache = async (key, fetchFunction, duration = 300) => {
  try {
    const data = await fetchFunction();
    cache.set(key, data, duration);
    logger.info(`Cache warmed up for key: ${key}`);
  } catch (error) {
    logger.error(`Cache warmup failed for key: ${key}`, error);
  }
};

module.exports = {
  cache,
  cacheMiddleware,
  clearCache,
  getCacheStats,
  warmupCache
};
