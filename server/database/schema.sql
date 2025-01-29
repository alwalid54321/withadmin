-- Create database
CREATE DATABASE IF NOT EXISTS market_data_admin;
USE market_data_admin;

-- Products table
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    fob_sdpzu DECIMAL(10,2),
    cnf_aejea DECIMAL(10,2),
    cnf_inach1 DECIMAL(10,2),
    cnf_cnahk DECIMAL(10,2),
    cnf_trmer DECIMAL(10,2),
    current_price DECIMAL(10,2),
    last_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    forecast ENUM('up', 'down') DEFAULT 'up',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Price history table
CREATE TABLE price_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT,
    price DECIMAL(10,2),
    indicator ENUM('up', 'down'),
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Currencies table
CREATE TABLE currencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    unit VARCHAR(50),
    central_bank DECIMAL(10,2),
    parallel_market DECIMAL(10,2),
    indicator ENUM('up', 'down'),
    flag_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
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
