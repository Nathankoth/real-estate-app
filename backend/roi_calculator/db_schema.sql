-- VistaForge ROI Calculator Database Schema
-- PostgreSQL database schema for comprehensive ROI analysis

-- Property inputs table
CREATE TABLE IF NOT EXISTS property_inputs (
    id SERIAL PRIMARY KEY,
    property_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    property_type VARCHAR(50) DEFAULT 'residential',
    purchase_price NUMERIC(15,2),
    gross_rent_annual NUMERIC(15,2),
    vacancy_rate NUMERIC(5,4) DEFAULT 0.05,
    operating_expenses NUMERIC(15,2),
    annual_mortgage_payment NUMERIC(15,2),
    equity NUMERIC(15,2),
    down_payment NUMERIC(15,2),
    loan_amount NUMERIC(15,2),
    interest_rate NUMERIC(5,4),
    loan_term_years INTEGER DEFAULT 30,
    property_taxes NUMERIC(15,2),
    insurance NUMERIC(15,2),
    maintenance NUMERIC(15,2),
    management_fee NUMERIC(15,2),
    utilities NUMERIC(15,2),
    other_expenses NUMERIC(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ROI results table
CREATE TABLE IF NOT EXISTS property_roi_results (
    property_id INTEGER PRIMARY KEY REFERENCES property_inputs(id) ON DELETE CASCADE,
    cap_rate NUMERIC(8,4),
    gross_yield NUMERIC(8,4),
    net_operating_income NUMERIC(15,2),
    pre_tax_cash_flow NUMERIC(15,2),
    cash_on_cash_return NUMERIC(8,4),
    dscr NUMERIC(8,4),
    npv NUMERIC(15,2),
    irr NUMERIC(8,4),
    payback_period_years NUMERIC(8,2),
    breakeven_occupancy NUMERIC(5,4),
    effective_gross_income NUMERIC(15,2),
    total_operating_expenses NUMERIC(15,2),
    net_income NUMERIC(15,2),
    debt_service NUMERIC(15,2),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table for backtesting
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES property_inputs(id) ON DELETE CASCADE,
    transaction_date DATE,
    transaction_type VARCHAR(50), -- 'purchase', 'sale', 'rent', 'expense'
    amount NUMERIC(15,2),
    description TEXT,
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Market data table
CREATE TABLE IF NOT EXISTS market_data (
    id SERIAL PRIMARY KEY,
    location VARCHAR(255),
    data_date DATE,
    median_home_price NUMERIC(15,2),
    median_rent NUMERIC(15,2),
    price_per_sqft NUMERIC(10,2),
    rent_per_sqft NUMERIC(10,2),
    cap_rate_market NUMERIC(8,4),
    vacancy_rate_market NUMERIC(5,4),
    appreciation_rate NUMERIC(8,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User portfolios
CREATE TABLE IF NOT EXISTS portfolios (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    portfolio_name VARCHAR(255),
    description TEXT,
    total_investment NUMERIC(15,2),
    total_equity NUMERIC(15,2),
    total_monthly_cash_flow NUMERIC(15,2),
    total_annual_return NUMERIC(8,4),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Portfolio properties junction table
CREATE TABLE IF NOT EXISTS portfolio_properties (
    portfolio_id INTEGER REFERENCES portfolios(id) ON DELETE CASCADE,
    property_id INTEGER REFERENCES property_inputs(id) ON DELETE CASCADE,
    allocation_percentage NUMERIC(5,2),
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (portfolio_id, property_id)
);

-- Analysis reports
CREATE TABLE IF NOT EXISTS analysis_reports (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES property_inputs(id) ON DELETE CASCADE,
    report_type VARCHAR(100), -- 'roi_analysis', 'backtest', 'market_analysis'
    report_data JSONB,
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Backtest results table
CREATE TABLE IF NOT EXISTS backtest_results (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES property_inputs(id) ON DELETE CASCADE,
    backtest_name VARCHAR(255),
    start_date DATE,
    end_date DATE,
    base_results JSONB,
    scenario_results JSONB,
    performance_metrics JSONB,
    insights JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Historical property data for backtesting
CREATE TABLE IF NOT EXISTS historical_property_data (
    id SERIAL PRIMARY KEY,
    property_id INTEGER REFERENCES property_inputs(id) ON DELETE CASCADE,
    data_date DATE,
    sold_price NUMERIC(15,2),
    listing_price NUMERIC(15,2),
    rent_annual NUMERIC(15,2),
    sale_date DATE,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    bedrooms INTEGER,
    bathrooms DECIMAL(3, 1),
    floor_area_sqm NUMERIC(10, 2),
    property_type VARCHAR(50),
    year_built INTEGER,
    neighborhood VARCHAR(255),
    source VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_property_inputs_created_at ON property_inputs(created_at);
CREATE INDEX IF NOT EXISTS idx_property_inputs_city_state ON property_inputs(city, state);
CREATE INDEX IF NOT EXISTS idx_roi_results_calculated_at ON property_roi_results(calculated_at);
CREATE INDEX IF NOT EXISTS idx_transactions_property_date ON transactions(property_id, transaction_date);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_market_data_location_date ON market_data(location, data_date);
CREATE INDEX IF NOT EXISTS idx_portfolios_user_id ON portfolios(user_id);

-- Sample data insertion
INSERT INTO property_inputs (
    property_name, address, city, state, zip_code, property_type,
    purchase_price, gross_rent_annual, vacancy_rate, operating_expenses,
    annual_mortgage_payment, equity, down_payment, loan_amount,
    interest_rate, loan_term_years, property_taxes, insurance,
    maintenance, management_fee, utilities, other_expenses
) VALUES 
(
    'Sample Property 1', '123 Main St', 'Austin', 'TX', '78701', 'residential',
    500000, 60000, 0.05, 15000, 30000, 100000, 100000, 400000,
    0.065, 30, 8000, 2000, 3000, 3000, 2000, 0
),
(
    'Sample Property 2', '456 Oak Ave', 'Dallas', 'TX', '75201', 'residential',
    750000, 90000, 0.08, 20000, 45000, 150000, 150000, 600000,
    0.07, 30, 12000, 3000, 4500, 4500, 3000, 0
),
(
    'Sample Property 3', '789 Pine St', 'Houston', 'TX', '77001', 'residential',
    300000, 36000, 0.03, 8000, 18000, 60000, 60000, 240000,
    0.06, 30, 5000, 1500, 2000, 2000, 1000, 0
);

-- Sample transactions
INSERT INTO transactions (property_id, transaction_date, transaction_type, amount, description, category) VALUES
(1, '2024-01-01', 'purchase', -500000, 'Property purchase', 'acquisition'),
(1, '2024-01-15', 'rent', 5000, 'Monthly rent collection', 'income'),
(1, '2024-01-15', 'expense', -1250, 'Monthly operating expenses', 'operating'),
(1, '2024-01-15', 'expense', -2500, 'Monthly mortgage payment', 'debt_service'),
(2, '2024-01-01', 'purchase', -750000, 'Property purchase', 'acquisition'),
(2, '2024-01-15', 'rent', 7500, 'Monthly rent collection', 'income'),
(2, '2024-01-15', 'expense', -1667, 'Monthly operating expenses', 'operating'),
(2, '2024-01-15', 'expense', -3750, 'Monthly mortgage payment', 'debt_service');

-- Sample market data
INSERT INTO market_data (location, data_date, median_home_price, median_rent, price_per_sqft, rent_per_sqft, cap_rate_market, vacancy_rate_market, appreciation_rate) VALUES
('Austin, TX', '2024-01-01', 550000, 2800, 350, 1.8, 0.06, 0.05, 0.08),
('Dallas, TX', '2024-01-01', 400000, 2200, 280, 1.4, 0.065, 0.06, 0.06),
('Houston, TX', '2024-01-01', 350000, 1800, 250, 1.2, 0.07, 0.04, 0.05);
