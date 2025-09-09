#!/usr/bin/env python3
"""
Test script for currency formatting utilities.
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from utils.currency import (
    format_currency, 
    format_percentage, 
    get_currency_symbol,
    format_currency_with_code,
    parse_currency_string
)

def test_currency_formatting():
    """Test currency formatting functions."""
    
    print("🧪 Testing Currency Formatting Utilities\n")
    
    # Test basic currency formatting
    print("1. Basic Currency Formatting:")
    test_amounts = [1234567.89, 0, 123.45, 1000000, -50000.25]
    for amount in test_amounts:
        formatted = format_currency(amount)
        print(f"   {amount:>12} → {formatted}")
    
    # Test different currency symbols
    print("\n2. Different Currency Symbols:")
    currencies = [("₦", "Nigerian Naira"), ("$", "US Dollar"), ("€", "Euro"), ("£", "British Pound")]
    amount = 1234567.89
    for symbol, name in currencies:
        formatted = format_currency(amount, symbol)
        print(f"   {name:>15} → {formatted}")
    
    # Test percentage formatting
    print("\n3. Percentage Formatting:")
    percentages = [0.06, 0.1234, 0.08, 0.15, 0.0025]
    for pct in percentages:
        formatted = format_percentage(pct)
        print(f"   {pct:>8} → {formatted}")
    
    # Test currency codes
    print("\n4. Currency Code Formatting:")
    codes = ["NGN", "USD", "EUR", "GBP", "CAD"]
    amount = 1234567.89
    for code in codes:
        formatted = format_currency_with_code(amount, code)
        print(f"   {code:>3} → {formatted}")
    
    # Test parsing
    print("\n5. Currency String Parsing:")
    currency_strings = ["₦1,234,567.89", "$1,234,567", "€123,456.78", "£1,000,000.00"]
    for currency_str in currency_strings:
        parsed = parse_currency_string(currency_str)
        print(f"   {currency_str:>15} → {parsed:>12}")
    
    # Test edge cases
    print("\n6. Edge Cases:")
    edge_cases = [None, "", "invalid", "₦", "₦0.00"]
    for case in edge_cases:
        if case is None:
            formatted = format_currency(case)
            print(f"   None → {formatted}")
        else:
            formatted = format_currency(case) if isinstance(case, (int, float)) else parse_currency_string(case)
            print(f"   {str(case):>10} → {formatted}")
    
    print("\n✅ All currency formatting tests completed!")

if __name__ == "__main__":
    test_currency_formatting()
