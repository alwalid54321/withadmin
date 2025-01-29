-- Create database
CREATE DATABASE IF NOT EXISTS market_data_admin;
USE market_data_admin;

-- Currencies table
CREATE TABLE currencies (
    id SERIAL PRIMARY KEY,
    code VARCHAR(3) NOT NULL,
    name VARCHAR(50) NOT NULL,
    rate_to_usd DECIMAL(10, 4) NOT NULL,
    flag_url VARCHAR(255),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    base_currency VARCHAR(3) DEFAULT 'USD',
    port_sudan_price DECIMAL(10, 2),
    dmt_china_price DECIMAL(10, 2),
    dmt_uae_price DECIMAL(10, 2),
    dmt_mersing_price DECIMAL(10, 2),
    dmt_india_price DECIMAL(10, 2),
    demand_level INTEGER CHECK (demand_level BETWEEN 0 AND 100),
    status VARCHAR(50),
    forecast_trend VARCHAR(20),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial currencies
INSERT INTO currencies (code, name, rate_to_usd, flag_url) VALUES
('USD', 'US Dollar', 1.0000, '/us.png'),
('AED', 'UAE Dirham', 3.6725, '/uae.png'),
('SDG', 'Sudanese Pound', 601.0000, '/sd.png');

-- Insert sample products
INSERT INTO products (
    name, base_currency, port_sudan_price, dmt_china_price, 
    dmt_uae_price, dmt_mersing_price, dmt_india_price, 
    demand_level, status, forecast_trend
) VALUES
('GADAREF SESAME', 'USD', 1200.00, 1300.00, 1440.00, 1650.00, 1500.00, 75, 'High', 'up'),
('COMMERCIAL SESAME', 'USD', 1100.00, 1200.00, 1300.00, 1400.00, 1350.00, 65, 'Medium', 'stable'),
('RED SESAME', 'USD', 1300.00, 1400.00, 1500.00, 1600.00, 1550.00, 80, 'High', 'up'),
('ACACIA SENEGAL', 'USD', 2500.00, 2600.00, 2700.00, 2800.00, 2750.00, 90, 'Very High', 'up'),
('ACACIA SEYAL', 'USD', 2000.00, 2100.00, 2200.00, 2300.00, 2250.00, 85, 'High', 'up'),
('PEANUTS', 'USD', 900.00, 1000.00, 1100.00, 1200.00, 1150.00, 70, 'Medium', 'stable'),
('COTTON', 'USD', 1800.00, 1900.00, 2000.00, 2100.00, 2050.00, 60, 'Medium', 'down'),
('WATERMELON SEEDS', 'USD', 800.00, 900.00, 1000.00, 1100.00, 1050.00, 55, 'Low', 'down'),
('CHICKPEAS', 'USD', 700.00, 800.00, 900.00, 1000.00, 950.00, 50, 'Low', 'stable'),
('PIGEON PEAS', 'USD', 600.00, 700.00, 800.00, 900.00, 850.00, 45, 'Low', 'down');

-- Price history table
CREATE TABLE price_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    price DECIMAL(10,2),
    indicator ENUM('up', 'down'),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Orders table for tracking
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    tracking_number VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO products (name, fob_sdpzu, cnf_aejea, cnf_inach1, cnf_cnahk, cnf_trmer, current_price) VALUES
('SESAME GADAREF', 1440.00, 1660.00, 1680.00, 1700.00, 1650.00, 1440.00),
('COMMERCIAL SESAME', 1420.00, 1640.00, 1660.00, 1680.00, 1630.00, 1420.00),
('RED SESAME', 1400.00, 1620.00, 1640.00, 1660.00, 1610.00, 1400.00),
('ACACIA SENEGAL', 2500.00, 2700.00, 2750.00, 2800.00, 2650.00, 2500.00),
('ACACIA SEYAL', 1200.00, 1400.00, 1450.00, 1500.00, 1350.00, 1200.00),
('PEANUTS', 1100.00, 1300.00, 1350.00, 1400.00, 1250.00, 1100.00),
('COTTON', 1800.00, 2000.00, 2050.00, 2100.00, 1950.00, 1800.00),
('WATERMELON SEEDS', 1600.00, 1800.00, 1850.00, 1900.00, 1750.00, 1600.00),
('CHICKPEAS', 900.00, 1100.00, 1150.00, 1200.00, 1050.00, 900.00),
('PIGEON PEAS', 850.00, 1050.00, 1100.00, 1150.00, 1000.00, 850.00);

INSERT INTO currencies (name, unit, central_bank, parallel_market, indicator, flag_url) VALUES
('USD', 'Dollar', 1.00, 1.00, 'up', '/flags/usd.png'),
('AED', 'Dirham', 3.67, 3.67, 'up', '/flags/aed.png'),
('SDG', 'Pound', 650.00, 750.00, 'down', '/flags/sdg.png');
