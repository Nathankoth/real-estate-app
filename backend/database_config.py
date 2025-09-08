"""
database_config.py
Database configuration and connection utilities for VistaForge ROI Engine
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Optional, Dict, Any

class DatabaseConfig:
    def __init__(self):
        # Database connection parameters
        self.db_config = {
            'dbname': os.getenv('DB_NAME', 'vistaforge_roi'),
            'user': os.getenv('DB_USER', 'postgres'),
            'password': os.getenv('DB_PASSWORD', 'password'),
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': os.getenv('DB_PORT', '5432')
        }
    
    def get_connection(self):
        """Get a database connection"""
        try:
            return psycopg2.connect(**self.db_config)
        except psycopg2.Error as e:
            print(f"Database connection error: {e}")
            raise
    
    def test_connection(self) -> bool:
        """Test database connection"""
        try:
            conn = self.get_connection()
            conn.close()
            return True
        except Exception as e:
            print(f"Database connection test failed: {e}")
            return False
    
    def create_tables(self):
        """Create database tables from schema"""
        try:
            conn = self.get_connection()
            with conn.cursor() as cur:
                # Read and execute schema file
                with open('database_schema.sql', 'r') as f:
                    schema_sql = f.read()
                cur.execute(schema_sql)
                conn.commit()
            conn.close()
            print("Database tables created successfully!")
            return True
        except Exception as e:
            print(f"Error creating tables: {e}")
            return False

# Global database config instance
db_config = DatabaseConfig()

def get_db_connection():
    """Get database connection using global config"""
    return db_config.get_connection()

def test_database():
    """Test database connection and setup"""
    if db_config.test_connection():
        print("✅ Database connection successful!")
        return True
    else:
        print("❌ Database connection failed!")
        return False

def setup_database():
    """Setup database tables"""
    if test_database():
        return db_config.create_tables()
    return False

if __name__ == "__main__":
    # Test database setup
    print("Testing VistaForge ROI Database Setup...")
    setup_database()
