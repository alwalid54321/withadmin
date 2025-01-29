-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    base_currency VARCHAR(3) DEFAULT 'USD',
    port_sudan_price DECIMAL(10, 2) NOT NULL,
    dmt_china_price DECIMAL(10, 2) NOT NULL,
    dmt_uae_price DECIMAL(10, 2) NOT NULL,
    dmt_mersing_price DECIMAL(10, 2) NOT NULL,
    dmt_india_price DECIMAL(10, 2) NOT NULL,
    demand_level INT NOT NULL,
    status ENUM('Low', 'Medium', 'High', 'Very High') DEFAULT 'Medium',
    forecast_trend ENUM('up', 'down', 'stable') DEFAULT 'stable',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
    id INT PRIMARY KEY AUTO_INCREMENT,
    code VARCHAR(3) NOT NULL UNIQUE,
    name VARCHAR(50) NOT NULL,
    rate_to_usd DECIMAL(10, 4) NOT NULL,
    flag_url VARCHAR(255),
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some sample currencies
INSERT INTO currencies (code, name, rate_to_usd, flag_url) VALUES
('USD', 'US Dollar', 1.0000, '/flags/usd.png'),
('AED', 'UAE Dirham', 3.6725, '/flags/aed.png'),
('SDG', 'Sudanese Pound', 601.0000, '/flags/sdg.png')
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    rate_to_usd = VALUES(rate_to_usd),
    flag_url = VALUES(flag_url);
