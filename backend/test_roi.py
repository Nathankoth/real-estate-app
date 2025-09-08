#!/usr/bin/env python3
"""
test_roi.py
Test script for VistaForge ROI Engine calculations
"""

from roi_engine import (
    effective_gross_income, noi, cap_rate, gross_yield,
    pre_tax_cash_flow, cash_on_cash, dscr, npv, irr
)

def test_roi_calculations():
    """Test ROI calculation functions with sample data"""
    
    print("🧮 VistaForge ROI Engine - Test Calculations")
    print("=" * 50)
    
    # Sample property data
    purchase_price = 500000
    gross_rent_annual = 60000
    vacancy_rate = 0.05  # 5%
    operating_expenses = 15000
    annual_mortgage_payment = 30000
    equity = 100000
    
    print(f"📊 Sample Property Data:")
    print(f"   Purchase Price: ${purchase_price:,.2f}")
    print(f"   Annual Gross Rent: ${gross_rent_annual:,.2f}")
    print(f"   Vacancy Rate: {vacancy_rate:.1%}")
    print(f"   Operating Expenses: ${operating_expenses:,.2f}")
    print(f"   Annual Mortgage Payment: ${annual_mortgage_payment:,.2f}")
    print(f"   Equity: ${equity:,.2f}")
    print()
    
    # Calculate metrics
    egi = effective_gross_income(gross_rent_annual, vacancy_rate)
    noi_value = noi(egi, operating_expenses)
    cap = cap_rate(noi_value, purchase_price)
    gross_yield_value = gross_yield(gross_rent_annual, purchase_price)
    pre_cf = pre_tax_cash_flow(noi_value, annual_mortgage_payment)
    coc = cash_on_cash(pre_cf, equity)
    dscr_value = dscr(noi_value, annual_mortgage_payment)
    
    print("📈 Calculated ROI Metrics:")
    print(f"   Effective Gross Income: ${egi:,.2f}")
    print(f"   Net Operating Income: ${noi_value:,.2f}")
    print(f"   Cap Rate: {cap:.2%}")
    print(f"   Gross Yield: {gross_yield_value:.2%}")
    print(f"   Pre-Tax Cash Flow: ${pre_cf:,.2f}")
    print(f"   Cash-on-Cash Return: {coc:.2%}")
    print(f"   Debt Service Coverage Ratio: {dscr_value:.2f}")
    print()
    
    # Test NPV and IRR calculations
    print("💰 DCF Analysis:")
    cash_flows = [-equity, pre_cf, pre_cf, pre_cf, pre_cf, pre_cf]  # 5-year projection
    discount_rate = 0.08  # 8% discount rate
    
    npv_value = npv(cash_flows, discount_rate)
    irr_value = irr(cash_flows)
    
    print(f"   5-Year Cash Flows: {[f'${cf:,.0f}' for cf in cash_flows]}")
    print(f"   Discount Rate: {discount_rate:.1%}")
    print(f"   NPV: ${npv_value:,.2f}")
    print(f"   IRR: {irr_value:.2%}")
    print()
    
    # Investment analysis
    print("🎯 Investment Analysis:")
    if cap > 0.06:  # 6% cap rate threshold
        print("   ✅ Good cap rate (>6%)")
    else:
        print("   ⚠️  Low cap rate (<6%)")
    
    if coc > 0.08:  # 8% cash-on-cash threshold
        print("   ✅ Good cash-on-cash return (>8%)")
    else:
        print("   ⚠️  Low cash-on-cash return (<8%)")
    
    if dscr_value > 1.25:  # 1.25 DSCR threshold
        print("   ✅ Strong debt service coverage (>1.25)")
    else:
        print("   ⚠️  Weak debt service coverage (<1.25)")
    
    if npv_value > 0:
        print("   ✅ Positive NPV - Good investment")
    else:
        print("   ❌ Negative NPV - Poor investment")
    
    print("\n🎉 ROI calculations completed successfully!")

if __name__ == "__main__":
    test_roi_calculations()
