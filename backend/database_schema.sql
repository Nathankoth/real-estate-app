-- VistaForge ROI Database Schema
-- PostgreSQL database tables for property ROI calculations

CREATE TABLE property_inputs (
  id SERIAL PRIMARY KEY,
  purchase_price NUMERIC,
  gross_rent_annual NUMERIC,
  vacancy_rate NUMERIC,
  operating_expenses NUMERIC,
  annual_mortgage_payment NUMERIC,
  equity NUMERIC,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE property_roi_results (
  property_id INT PRIMARY KEY REFERENCES property_inputs(id),
  cap_rate NUMERIC,
  noi NUMERIC,
  cash_on_cash NUMERIC,
  dscr NUMERIC,
  pre_tax_cash_flow NUMERIC,
  updated_at TIMESTAMP DEFAULT now()
);

-- Indexes for better performance
CREATE INDEX idx_property_inputs_created_at ON property_inputs(created_at);
CREATE INDEX idx_property_roi_results_updated_at ON property_roi_results(updated_at);

-- Sample data for testing
INSERT INTO property_inputs (
  purchase_price, 
  gross_rent_annual, 
  vacancy_rate, 
  operating_expenses, 
  annual_mortgage_payment, 
  equity
) VALUES 
(500000, 60000, 0.05, 15000, 30000, 100000),
(750000, 90000, 0.08, 20000, 45000, 150000),
(300000, 36000, 0.03, 8000, 18000, 60000);
