"""
VistaForge Database Utilities
Database connection management and utilities for ROI calculator
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from contextlib import contextmanager
from typing import Dict, List, Any, Optional, Generator
import logging
from datetime import datetime
import json

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DatabaseManager:
    """
    Database connection and query management for ROI calculator
    """
    
    def __init__(self, connection_string: str = None):
        """
        Initialize database manager
        
        Args:
            connection_string: PostgreSQL connection string
        """
        self.connection_string = connection_string or self._get_connection_string()
        self._test_connection()
    
    def _get_connection_string(self) -> str:
        """
        Get database connection string from environment variables
        """
        return os.getenv('DATABASE_URL', 
                        f"postgresql://{os.getenv('DB_USER', 'postgres')}:"
                        f"{os.getenv('DB_PASSWORD', 'password')}@"
                        f"{os.getenv('DB_HOST', 'localhost')}:"
                        f"{os.getenv('DB_PORT', '5432')}/"
                        f"{os.getenv('DB_NAME', 'vistaforge_roi')}")
    
    def _test_connection(self):
        """
        Test database connection
        """
        try:
            with self.get_connection() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT 1")
            logger.info("Database connection successful")
        except Exception as e:
            logger.error(f"Database connection failed: {e}")
            raise
    
    @contextmanager
    def get_connection(self) -> Generator[psycopg2.extensions.connection, None, None]:
        """
        Get database connection with automatic cleanup
        """
        conn = None
        try:
            conn = psycopg2.connect(self.connection_string)
            yield conn
        except Exception as e:
            if conn:
                conn.rollback()
            logger.error(f"Database error: {e}")
            raise
        finally:
            if conn:
                conn.close()
    
    def execute_query(self, query: str, params: tuple = None, fetch: str = 'all') -> Any:
        """
        Execute a database query
        
        Args:
            query: SQL query string
            params: Query parameters
            fetch: 'all', 'one', or 'none'
        
        Returns:
            Query results
        """
        with self.get_connection() as conn:
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(query, params)
                
                if fetch == 'all':
                    return cur.fetchall()
                elif fetch == 'one':
                    return cur.fetchone()
                else:
                    conn.commit()
                    return cur.rowcount
    
    def create_tables(self):
        """
        Create database tables if they don't exist
        """
        tables_sql = """
        -- Properties table
        CREATE TABLE IF NOT EXISTS properties (
            id SERIAL PRIMARY KEY,
            property_name VARCHAR(255) NOT NULL,
            address TEXT,
            city VARCHAR(100),
            state VARCHAR(50),
            zip_code VARCHAR(20),
            property_type VARCHAR(50) DEFAULT 'residential',
            purchase_price DECIMAL(15,2) NOT NULL,
            gross_rent_annual DECIMAL(15,2) NOT NULL,
            vacancy_rate DECIMAL(5,4) DEFAULT 0.05,
            operating_expenses DECIMAL(15,2) NOT NULL,
            annual_mortgage_payment DECIMAL(15,2) DEFAULT 0,
            equity DECIMAL(15,2) NOT NULL,
            down_payment DECIMAL(15,2),
            loan_amount DECIMAL(15,2),
            interest_rate DECIMAL(5,4),
            loan_term_years INTEGER DEFAULT 30,
            property_taxes DECIMAL(15,2),
            insurance DECIMAL(15,2),
            maintenance DECIMAL(15,2),
            management_fee DECIMAL(15,2),
            utilities DECIMAL(15,2),
            other_expenses DECIMAL(15,2),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- ROI Results table
        CREATE TABLE IF NOT EXISTS roi_results (
            id SERIAL PRIMARY KEY,
            property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
            cap_rate DECIMAL(8,6),
            gross_yield DECIMAL(8,6),
            noi DECIMAL(15,2),
            pre_tax_cash_flow DECIMAL(15,2),
            cash_on_cash DECIMAL(8,6),
            dscr DECIMAL(8,4),
            npv DECIMAL(15,2),
            irr DECIMAL(8,6),
            total_return DECIMAL(8,6),
            annualized_return DECIMAL(8,6),
            projected_value DECIMAL(15,2),
            total_cash_flow DECIMAL(15,2),
            calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Monthly Performance table
        CREATE TABLE IF NOT EXISTS monthly_performance (
            id SERIAL PRIMARY KEY,
            property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
            month_year DATE NOT NULL,
            income DECIMAL(15,2) NOT NULL,
            expenses DECIMAL(15,2) NOT NULL,
            roi DECIMAL(8,4),
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(property_id, month_year)
        );
        
        -- Market Data table
        CREATE TABLE IF NOT EXISTS market_data (
            id SERIAL PRIMARY KEY,
            location VARCHAR(255) NOT NULL,
            data_type VARCHAR(50) NOT NULL,
            value DECIMAL(15,2) NOT NULL,
            date_recorded DATE NOT NULL,
            source VARCHAR(255),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Backtest Results table
        CREATE TABLE IF NOT EXISTS backtest_results (
            id SERIAL PRIMARY KEY,
            property_id INTEGER REFERENCES properties(id) ON DELETE CASCADE,
            backtest_name VARCHAR(255) NOT NULL,
            start_date DATE NOT NULL,
            end_date DATE NOT NULL,
            initial_value DECIMAL(15,2) NOT NULL,
            final_value DECIMAL(15,2) NOT NULL,
            total_return DECIMAL(8,6),
            annualized_return DECIMAL(8,6),
            max_drawdown DECIMAL(8,6),
            sharpe_ratio DECIMAL(8,4),
            results_json JSONB,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        
        -- Create indexes for better performance
        CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at);
        CREATE INDEX IF NOT EXISTS idx_roi_results_property_id ON roi_results(property_id);
        CREATE INDEX IF NOT EXISTS idx_monthly_performance_property_id ON monthly_performance(property_id);
        CREATE INDEX IF NOT EXISTS idx_monthly_performance_month_year ON monthly_performance(month_year);
        CREATE INDEX IF NOT EXISTS idx_market_data_location ON market_data(location);
        CREATE INDEX IF NOT EXISTS idx_market_data_date ON market_data(date_recorded);
        CREATE INDEX IF NOT EXISTS idx_backtest_results_property_id ON backtest_results(property_id);
        """
        
        try:
            self.execute_query(tables_sql, fetch='none')
            logger.info("Database tables created successfully")
        except Exception as e:
            logger.error(f"Error creating tables: {e}")
            raise
    
    def insert_property(self, property_data: Dict[str, Any]) -> int:
        """
        Insert a new property into the database
        
        Args:
            property_data: Property information dictionary
        
        Returns:
            Property ID
        """
        query = """
        INSERT INTO properties (
            property_name, address, city, state, zip_code, property_type,
            purchase_price, gross_rent_annual, vacancy_rate, operating_expenses,
            annual_mortgage_payment, equity, down_payment, loan_amount,
            interest_rate, loan_term_years, property_taxes, insurance,
            maintenance, management_fee, utilities, other_expenses
        ) VALUES (
            %(property_name)s, %(address)s, %(city)s, %(state)s, %(zip_code)s, %(property_type)s,
            %(purchase_price)s, %(gross_rent_annual)s, %(vacancy_rate)s, %(operating_expenses)s,
            %(annual_mortgage_payment)s, %(equity)s, %(down_payment)s, %(loan_amount)s,
            %(interest_rate)s, %(loan_term_years)s, %(property_taxes)s, %(insurance)s,
            %(maintenance)s, %(management_fee)s, %(utilities)s, %(other_expenses)s
        ) RETURNING id
        """
        
        result = self.execute_query(query, property_data, fetch='one')
        return result['id']
    
    def get_property(self, property_id: int) -> Optional[Dict[str, Any]]:
        """
        Get property by ID
        
        Args:
            property_id: Property ID
        
        Returns:
            Property data dictionary
        """
        query = "SELECT * FROM properties WHERE id = %s"
        result = self.execute_query(query, (property_id,), fetch='one')
        return dict(result) if result else None
    
    def get_all_properties(self) -> List[Dict[str, Any]]:
        """
        Get all properties
        
        Returns:
            List of property dictionaries
        """
        query = "SELECT * FROM properties ORDER BY created_at DESC"
        results = self.execute_query(query, fetch='all')
        return [dict(row) for row in results]
    
    def update_property(self, property_id: int, property_data: Dict[str, Any]) -> bool:
        """
        Update property information
        
        Args:
            property_id: Property ID
            property_data: Updated property data
        
        Returns:
            Success status
        """
        # Add updated_at timestamp
        property_data['updated_at'] = datetime.now()
        
        # Build dynamic update query
        set_clauses = [f"{key} = %({key})s" for key in property_data.keys()]
        query = f"""
        UPDATE properties 
        SET {', '.join(set_clauses)}
        WHERE id = %(property_id)s
        """
        
        property_data['property_id'] = property_id
        rows_affected = self.execute_query(query, property_data, fetch='none')
        return rows_affected > 0
    
    def delete_property(self, property_id: int) -> bool:
        """
        Delete property and related data
        
        Args:
            property_id: Property ID
        
        Returns:
            Success status
        """
        query = "DELETE FROM properties WHERE id = %s"
        rows_affected = self.execute_query(query, (property_id,), fetch='none')
        return rows_affected > 0
    
    def insert_roi_result(self, property_id: int, roi_data: Dict[str, Any]) -> int:
        """
        Insert ROI calculation results
        
        Args:
            property_id: Property ID
            roi_data: ROI metrics dictionary
        
        Returns:
            ROI result ID
        """
        query = """
        INSERT INTO roi_results (
            property_id, cap_rate, gross_yield, noi, pre_tax_cash_flow,
            cash_on_cash, dscr, npv, irr, total_return, annualized_return,
            projected_value, total_cash_flow
        ) VALUES (
            %(property_id)s, %(cap_rate)s, %(gross_yield)s, %(noi)s, %(pre_tax_cash_flow)s,
            %(cash_on_cash)s, %(dscr)s, %(npv)s, %(irr)s, %(total_return)s, %(annualized_return)s,
            %(projected_value)s, %(total_cash_flow)s
        ) RETURNING id
        """
        
        roi_data['property_id'] = property_id
        result = self.execute_query(query, roi_data, fetch='one')
        return result['id']
    
    def get_roi_results(self, property_id: int) -> List[Dict[str, Any]]:
        """
        Get ROI results for a property
        
        Args:
            property_id: Property ID
        
        Returns:
            List of ROI result dictionaries
        """
        query = """
        SELECT * FROM roi_results 
        WHERE property_id = %s 
        ORDER BY calculated_at DESC
        """
        results = self.execute_query(query, (property_id,), fetch='all')
        return [dict(row) for row in results]
    
    def insert_monthly_performance(self, property_id: int, month_year: str, 
                                 income: float, expenses: float, notes: str = None) -> int:
        """
        Insert monthly performance data
        
        Args:
            property_id: Property ID
            month_year: Month and year (YYYY-MM format)
            income: Monthly income
            expenses: Monthly expenses
            notes: Optional notes
        
        Returns:
            Performance record ID
        """
        roi = ((income - expenses) / expenses * 100) if expenses > 0 else 0
        
        query = """
        INSERT INTO monthly_performance (
            property_id, month_year, income, expenses, roi, notes
        ) VALUES (
            %(property_id)s, %(month_year)s, %(income)s, %(expenses)s, %(roi)s, %(notes)s
        ) RETURNING id
        """
        
        data = {
            'property_id': property_id,
            'month_year': month_year,
            'income': income,
            'expenses': expenses,
            'roi': roi,
            'notes': notes
        }
        
        result = self.execute_query(query, data, fetch='one')
        return result['id']
    
    def get_monthly_performance(self, property_id: int, start_date: str = None, 
                              end_date: str = None) -> List[Dict[str, Any]]:
        """
        Get monthly performance data for a property
        
        Args:
            property_id: Property ID
            start_date: Start date filter (YYYY-MM)
            end_date: End date filter (YYYY-MM)
        
        Returns:
            List of performance records
        """
        query = "SELECT * FROM monthly_performance WHERE property_id = %s"
        params = [property_id]
        
        if start_date:
            query += " AND month_year >= %s"
            params.append(start_date)
        
        if end_date:
            query += " AND month_year <= %s"
            params.append(end_date)
        
        query += " ORDER BY month_year DESC"
        
        results = self.execute_query(query, tuple(params), fetch='all')
        return [dict(row) for row in results]
    
    def insert_market_data(self, location: str, data_type: str, value: float, 
                          date_recorded: str, source: str = None) -> int:
        """
        Insert market data
        
        Args:
            location: Location identifier
            data_type: Type of market data
            value: Data value
            date_recorded: Date of the data
            source: Data source
        
        Returns:
            Market data ID
        """
        query = """
        INSERT INTO market_data (location, data_type, value, date_recorded, source)
        VALUES (%(location)s, %(data_type)s, %(value)s, %(date_recorded)s, %(source)s)
        RETURNING id
        """
        
        data = {
            'location': location,
            'data_type': data_type,
            'value': value,
            'date_recorded': date_recorded,
            'source': source
        }
        
        result = self.execute_query(query, data, fetch='one')
        return result['id']
    
    def get_market_data(self, location: str, data_type: str = None, 
                       start_date: str = None, end_date: str = None) -> List[Dict[str, Any]]:
        """
        Get market data
        
        Args:
            location: Location identifier
            data_type: Type of market data
            start_date: Start date filter
            end_date: End date filter
        
        Returns:
            List of market data records
        """
        query = "SELECT * FROM market_data WHERE location = %s"
        params = [location]
        
        if data_type:
            query += " AND data_type = %s"
            params.append(data_type)
        
        if start_date:
            query += " AND date_recorded >= %s"
            params.append(start_date)
        
        if end_date:
            query += " AND date_recorded <= %s"
            params.append(end_date)
        
        query += " ORDER BY date_recorded DESC"
        
        results = self.execute_query(query, tuple(params), fetch='all')
        return [dict(row) for row in results]
    
    def insert_backtest_result(self, property_id: int, backtest_name: str,
                             start_date: str, end_date: str, initial_value: float,
                             final_value: float, results_data: Dict[str, Any]) -> int:
        """
        Insert backtest results
        
        Args:
            property_id: Property ID
            backtest_name: Name of the backtest
            start_date: Start date
            end_date: End date
            initial_value: Initial portfolio value
            final_value: Final portfolio value
            results_data: Detailed backtest results
        
        Returns:
            Backtest result ID
        """
        total_return = (final_value - initial_value) / initial_value if initial_value > 0 else 0
        
        # Calculate annualized return
        start_dt = datetime.strptime(start_date, '%Y-%m-%d')
        end_dt = datetime.strptime(end_date, '%Y-%m-%d')
        years = (end_dt - start_dt).days / 365.25
        annualized_return = (1 + total_return) ** (1 / years) - 1 if years > 0 else 0
        
        query = """
        INSERT INTO backtest_results (
            property_id, backtest_name, start_date, end_date,
            initial_value, final_value, total_return, annualized_return,
            results_json
        ) VALUES (
            %(property_id)s, %(backtest_name)s, %(start_date)s, %(end_date)s,
            %(initial_value)s, %(final_value)s, %(total_return)s, %(annualized_return)s,
            %(results_json)s
        ) RETURNING id
        """
        
        data = {
            'property_id': property_id,
            'backtest_name': backtest_name,
            'start_date': start_date,
            'end_date': end_date,
            'initial_value': initial_value,
            'final_value': final_value,
            'total_return': total_return,
            'annualized_return': annualized_return,
            'results_json': json.dumps(results_data)
        }
        
        result = self.execute_query(query, data, fetch='one')
        return result['id']
    
    def get_backtest_results(self, property_id: int = None) -> List[Dict[str, Any]]:
        """
        Get backtest results
        
        Args:
            property_id: Optional property ID filter
        
        Returns:
            List of backtest result dictionaries
        """
        if property_id:
            query = "SELECT * FROM backtest_results WHERE property_id = %s ORDER BY created_at DESC"
            params = (property_id,)
        else:
            query = "SELECT * FROM backtest_results ORDER BY created_at DESC"
            params = None
        
        results = self.execute_query(query, params, fetch='all')
        return [dict(row) for row in results]
    
    def get_portfolio_summary(self) -> Dict[str, Any]:
        """
        Get portfolio summary statistics
        
        Returns:
            Portfolio summary dictionary
        """
        query = """
        SELECT 
            COUNT(*) as total_properties,
            SUM(purchase_price) as total_investment,
            AVG(purchase_price) as avg_property_value,
            SUM(gross_rent_annual) as total_annual_rent,
            AVG(vacancy_rate) as avg_vacancy_rate
        FROM properties
        """
        
        result = self.execute_query(query, fetch='one')
        return dict(result) if result else {}
    
    def cleanup_old_data(self, days_old: int = 365):
        """
        Clean up old data
        
        Args:
            days_old: Number of days to keep data
        """
        cutoff_date = datetime.now() - timedelta(days=days_old)
        
        # Clean up old market data
        query = "DELETE FROM market_data WHERE date_recorded < %s"
        self.execute_query(query, (cutoff_date.date(),), fetch='none')
        
        logger.info(f"Cleaned up data older than {days_old} days")

# Global database manager instance
_db_manager = None

def get_db_manager() -> DatabaseManager:
    """
    Get global database manager instance
    """
    global _db_manager
    if _db_manager is None:
        _db_manager = DatabaseManager()
    return _db_manager

def init_database():
    """
    Initialize database with tables
    """
    db = get_db_manager()
    db.create_tables()
    logger.info("Database initialized successfully")

if __name__ == "__main__":
    # Initialize database when run directly
    init_database()