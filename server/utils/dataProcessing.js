const { logger } = require('../config/db');

// Calculate price trends and indicators
const calculatePriceTrends = (priceHistory) => {
  if (!priceHistory || priceHistory.length < 2) {
    return {
      trend: 'stable',
      percentage: 0,
      indicator: 'neutral'
    };
  }

  const sortedPrices = priceHistory
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(item => item.price);

  const currentPrice = sortedPrices[0];
  const previousPrice = sortedPrices[1];
  
  const difference = currentPrice - previousPrice;
  const percentage = ((difference / previousPrice) * 100).toFixed(2);

  return {
    trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'stable',
    percentage: Math.abs(percentage),
    indicator: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral'
  };
};

// Format currency values
const formatCurrency = (value, currency = 'USD', locale = 'en-US') => {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(value);
  } catch (error) {
    logger.error('Currency formatting error:', error);
    return value.toFixed(2);
  }
};

// Calculate market statistics
const calculateMarketStats = (products) => {
  try {
    const stats = products.reduce((acc, product) => {
      // Calculate average prices
      acc.avgFobPrice += product.fob_sdpzu || 0;
      acc.avgCnfPrice += (
        (product.cnf_aejea || 0) +
        (product.cnf_inach1 || 0) +
        (product.cnf_cnahk || 0) +
        (product.cnf_trmer || 0)
      ) / 4;

      // Track price movements
      const trend = calculatePriceTrends(product.price_history);
      if (trend.trend === 'up') acc.increasingProducts++;
      if (trend.trend === 'down') acc.decreasingProducts++;

      return acc;
    }, {
      avgFobPrice: 0,
      avgCnfPrice: 0,
      increasingProducts: 0,
      decreasingProducts: 0
    });

    // Calculate averages
    const productCount = products.length;
    stats.avgFobPrice = stats.avgFobPrice / productCount;
    stats.avgCnfPrice = stats.avgCnfPrice / productCount;

    return stats;
  } catch (error) {
    logger.error('Error calculating market stats:', error);
    throw error;
  }
};

// Generate price forecast
const generatePriceForecast = (priceHistory, periods = 3) => {
  try {
    if (!priceHistory || priceHistory.length < 2) {
      return null;
    }

    // Simple moving average forecast
    const prices = priceHistory
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => item.price);

    const movingAverage = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    const lastPrice = prices[prices.length - 1];
    
    // Calculate trend
    const trend = (lastPrice - prices[0]) / prices.length;

    // Generate forecast
    return Array(periods).fill(0).map((_, index) => ({
      period: index + 1,
      forecast: movingAverage + (trend * (index + 1)),
      confidence: Math.max(0, 100 - (index * 15)) // Decrease confidence for further periods
    }));
  } catch (error) {
    logger.error('Error generating price forecast:', error);
    return null;
  }
};

// Process and validate product data
const processProductData = (productData) => {
  try {
    const {
      name,
      fob_sdpzu,
      cnf_aejea,
      cnf_inach1,
      cnf_cnahk,
      cnf_trmer,
      current_price,
      price_history
    } = productData;

    // Basic validation
    if (!name || typeof name !== 'string') {
      throw new Error('Invalid product name');
    }

    // Process prices
    const prices = {
      fob_sdpzu: parseFloat(fob_sdpzu) || 0,
      cnf_aejea: parseFloat(cnf_aejea) || 0,
      cnf_inach1: parseFloat(cnf_inach1) || 0,
      cnf_cnahk: parseFloat(cnf_cnahk) || 0,
      cnf_trmer: parseFloat(cnf_trmer) || 0,
      current_price: parseFloat(current_price) || 0
    };

    // Validate prices
    Object.entries(prices).forEach(([key, value]) => {
      if (value < 0) {
        throw new Error(`Invalid price value for ${key}`);
      }
    });

    // Process price history
    const processedHistory = Array.isArray(price_history) 
      ? price_history.map(entry => ({
          price: parseFloat(entry.price) || 0,
          date: new Date(entry.date),
          indicator: entry.indicator || 'neutral'
        }))
      : [];

    return {
      name: name.trim(),
      ...prices,
      price_history: processedHistory,
      trends: calculatePriceTrends(processedHistory),
      forecast: generatePriceForecast(processedHistory)
    };
  } catch (error) {
    logger.error('Error processing product data:', error);
    throw error;
  }
};

module.exports = {
  calculatePriceTrends,
  formatCurrency,
  calculateMarketStats,
  generatePriceForecast,
  processProductData
};
