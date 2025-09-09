#!/usr/bin/env python3
"""
Test script for professional real estate analysis.
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from templates.real_estate_analysis import generate_real_estate_analysis

def test_professional_analysis():
    """Test professional real estate analysis generation."""
    
    print("🏢 Testing Professional Real Estate Analysis\n")
    
    # Test cases for different markets
    test_cases = [
        {
            "name": "Nigerian Property",
            "metrics": {
                "cap_rate": 0.06,
                "cash_on_cash": 0.08,
                "noi": 1200000,
                "dscr": 1.25,
                "terminal_value": 25000000
            },
            "currency_symbol": "₦",
            "region": "Nigeria"
        },
        {
            "name": "US Property",
            "metrics": {
                "cap_rate": 0.05,
                "cash_on_cash": 0.07,
                "noi": 50000,
                "dscr": 1.15,
                "terminal_value": 1000000
            },
            "currency_symbol": "$",
            "region": "USA"
        },
        {
            "name": "UK Property",
            "metrics": {
                "cap_rate": 0.04,
                "cash_on_cash": 0.06,
                "noi": 30000,
                "dscr": 1.30,
                "terminal_value": 750000
            },
            "currency_symbol": "£",
            "region": "UK"
        }
    ]
    
    for i, case in enumerate(test_cases, 1):
        print(f"{'='*80}")
        print(f"ANALYSIS {i}: {case['name']}")
        print(f"{'='*80}")
        
        analysis = generate_real_estate_analysis(
            case['metrics'],
            case['currency_symbol'],
            case['region']
        )
        
        print(analysis)
        print("\n")
    
    print("✅ All professional analysis tests completed!")

if __name__ == "__main__":
    test_professional_analysis()
