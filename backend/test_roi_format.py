#!/usr/bin/env python3
"""
Test script for ROI results formatting.
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.currency import format_currency
from main import format_roi_results

def test_roi_formatting():
    """Test ROI results formatting function."""
    
    print("🧪 Testing ROI Results Formatting\n")
    
    # Test data
    test_cases = [
        {
            "name": "Nigerian Property",
            "noi": 1200000,
            "cap_rate": 0.06,
            "coc": 0.08,
            "dscr": 1.25,
            "terminal_value": 25000000,
            "currency_symbol": "₦"
        },
        {
            "name": "US Property",
            "noi": 50000,
            "cap_rate": 0.05,
            "coc": 0.07,
            "dscr": 1.15,
            "terminal_value": 1000000,
            "currency_symbol": "$"
        },
        {
            "name": "UK Property",
            "noi": 30000,
            "cap_rate": 0.04,
            "coc": 0.06,
            "dscr": 1.30,
            "terminal_value": 750000,
            "currency_symbol": "£"
        }
    ]
    
    for i, case in enumerate(test_cases, 1):
        print(f"{i}. {case['name']}:")
        
        # Test your exact format
        result = format_roi_results(
            noi=case['noi'],
            cap_rate=case['cap_rate'],
            coc=case['coc'],
            dscr=case['dscr'],
            terminal_value=case['terminal_value'],
            currency_symbol=case['currency_symbol']
        )
        
        print(f"   NOI: {result['NOI']}")
        print(f"   Cap Rate: {result['CapRate']}")
        print(f"   Cash-on-Cash: {result['CashOnCash']}")
        print(f"   DSCR: {result['DSCR']}")
        print(f"   Terminal Value: {result['TerminalValue']}")
        print()
    
    # Test edge cases
    print("2. Edge Cases:")
    
    # Zero values
    zero_result = format_roi_results(0, 0, 0, 0, 0)
    print(f"   Zero values: {zero_result}")
    
    # Negative values
    negative_result = format_roi_results(-100000, -0.02, -0.01, 0.5, 500000)
    print(f"   Negative values: {negative_result}")
    
    # Large values
    large_result = format_roi_results(1000000000, 0.15, 0.20, 2.5, 5000000000)
    print(f"   Large values: {large_result}")
    
    print("\n✅ All ROI formatting tests completed!")

def test_individual_formatting():
    """Test individual currency formatting."""
    
    print("\n🔧 Testing Individual Currency Formatting:\n")
    
    # Test your original format_currency function
    test_amounts = [1200000, 25000000, 50000, 1000000]
    symbols = ["₦", "$", "£", "€"]
    
    for amount, symbol in zip(test_amounts, symbols):
        formatted = format_currency(amount, symbol)
        print(f"   {symbol}{amount:,} → {formatted}")

if __name__ == "__main__":
    test_roi_formatting()
    test_individual_formatting()
