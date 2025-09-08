#!/usr/bin/env python3
"""
setup_database.py
Database setup script for VistaForge ROI Engine
"""

import os
import sys
from database_config import setup_database, test_database

def main():
    print("🏗️  VistaForge ROI Database Setup")
    print("=" * 40)
    
    # Check if database connection works
    print("1. Testing database connection...")
    if not test_database():
        print("❌ Database connection failed!")
        print("\nPlease ensure PostgreSQL is running and configure your database settings:")
        print("- Set environment variables: DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT")
        print("- Or update database_config.py with your database credentials")
        return False
    
    print("✅ Database connection successful!")
    
    # Setup database tables
    print("\n2. Setting up database tables...")
    if setup_database():
        print("✅ Database setup completed successfully!")
        print("\n🎉 Your VistaForge ROI Engine is ready to use!")
        print("\nAPI Endpoints available:")
        print("- POST /roi/calculate - Calculate ROI without storing")
        print("- POST /roi/property - Create new property")
        print("- GET /roi/property/{id} - Get property details")
        print("- GET /roi/property/{id}/calculate - Calculate ROI for property")
        print("- GET /roi/properties - List all properties")
        print("- GET /roi/health - Health check")
        return True
    else:
        print("❌ Database setup failed!")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
