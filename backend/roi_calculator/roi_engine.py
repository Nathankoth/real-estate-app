"""
VistaForge ROI Engine
Comprehensive real estate investment analysis and ROI calculation engine
"""

import math
from typing import Dict, List, Any, Optional
import pandas as pd
import numpy as np
from datetime import datetime, timedelta

class ROIEngine:
    """
    Advanced ROI calculation engine for real estate investments
    """
    
    def __init__(self):
        self.metrics_cache = {}
    
    def effective_gross_income(self, gross_rent_annual: float, vacancy_rate: float) -> float:
        """
        Calculate Effective Gross Income (EGI)
        EGI = Gross Rent Annual * (1 - Vacancy Rate)
        """
        return gross_rent_annual * (1 - vacancy_rate)
    
    def net_operating_income(self, egi: float, operating_expenses: float) -> float:
        """
        Calculate Net Operating Income (NOI)
        NOI = EGI - Operating Expenses
        """
        return egi - operating_expenses
    
    def cap_rate(self, noi: float, purchase_price: float) -> float:
        """
        Calculate Capitalization Rate
        Cap Rate = NOI / Purchase Price
        """
        if purchase_price == 0:
            return 0.0
        return noi / purchase_price
    
    def gross_yield(self, gross_rent_annual: float, purchase_price: float) -> float:
        """
        Calculate Gross Yield
        Gross Yield = Gross Rent Annual / Purchase Price
        """
        if purchase_price == 0:
            return 0.0
        return gross_rent_annual / purchase_price
    
    def pre_tax_cash_flow(self, noi: float, annual_mortgage_payment: float) -> float:
        """
        Calculate Pre-Tax Cash Flow
        Pre-Tax Cash Flow = NOI - Annual Mortgage Payment
        """
        return noi - annual_mortgage_payment
    
    def cash_on_cash_return(self, pre_tax_cash_flow: float, equity: float) -> float:
        """
        Calculate Cash-on-Cash Return
        Cash-on-Cash = Pre-Tax Cash Flow / Equity
        """
        if equity == 0:
            return 0.0
        return pre_tax_cash_flow / equity
    
    def debt_service_coverage_ratio(self, noi: float, annual_mortgage_payment: float) -> float:
        """
        Calculate Debt Service Coverage Ratio (DSCR)
        DSCR = NOI / Annual Mortgage Payment
        """
        if annual_mortgage_payment == 0:
            return float('inf')
        return noi / annual_mortgage_payment
    
    def net_present_value(self, cash_flows: List[float], discount_rate: float, initial_investment: float) -> float:
        """
        Calculate Net Present Value (NPV)
        NPV = Σ(CF_t / (1 + r)^t) - Initial Investment
        """
        npv = -initial_investment
        for t, cf in enumerate(cash_flows, 1):
            npv += cf / ((1 + discount_rate) ** t)
        return npv
    
    def net_present_value_simple(self, cash_flows: List[float], discount_rate: float) -> float:
        """
        Calculate Net Present Value (NPV) - simple version without initial investment parameter
        NPV = Σ(CF_t / (1 + r)^t)
        """
        return sum(cf / ((1.0 + discount_rate) ** i) for i, cf in enumerate(cash_flows))
    
    def internal_rate_of_return(self, cash_flows: List[float], initial_investment: float, max_iterations: int = 100) -> float:
        """
        Calculate Internal Rate of Return (IRR) using Newton-Raphson method
        """
        if not cash_flows:
            return 0.0
        
        # Initial guess
        rate = 0.1
        
        for _ in range(max_iterations):
            npv = -initial_investment
            npv_derivative = 0
            
            for t, cf in enumerate(cash_flows, 1):
                discount_factor = (1 + rate) ** t
                npv += cf / discount_factor
                npv_derivative -= t * cf / (discount_factor * (1 + rate))
            
            if abs(npv_derivative) < 1e-10:
                break
                
            new_rate = rate - npv / npv_derivative
            
            if abs(new_rate - rate) < 1e-6:
                break
                
            rate = new_rate
        
        return rate
    
    def internal_rate_of_return_simple(self, cash_flows: List[float]) -> float:
        """
        Calculate Internal Rate of Return (IRR) using numpy_financial with fallback
        """
        try:
            import numpy_financial as nf
            return float(nf.irr(cash_flows))
        except Exception:
            # Simple fallback: return NaN if library not available
            return float("nan")
    
    def calculate_loan_payment(self, loan_amount: float, annual_rate: float, years: int) -> float:
        """
        Calculate monthly mortgage payment
        """
        if annual_rate == 0:
            return loan_amount / (years * 12)
        
        monthly_rate = annual_rate / 12
        num_payments = years * 12
        
        monthly_payment = loan_amount * (monthly_rate * (1 + monthly_rate) ** num_payments) / \
                         ((1 + monthly_rate) ** num_payments - 1)
        
        return monthly_payment
    
    def calculate_annual_mortgage_payment(self, loan_amount: float, annual_rate: float, years: int) -> float:
        """
        Calculate annual mortgage payment
        """
        return self.calculate_loan_payment(loan_amount, annual_rate, years) * 12
    
    def calculate_equity(self, purchase_price: float, down_payment: float) -> float:
        """
        Calculate equity (down payment)
        """
        return down_payment
    
    def calculate_loan_amount(self, purchase_price: float, down_payment: float) -> float:
        """
        Calculate loan amount
        """
        return purchase_price - down_payment
    
    def calculate_property_value_appreciation(self, current_value: float, annual_appreciation: float, years: int) -> float:
        """
        Calculate future property value with appreciation
        """
        return current_value * ((1 + annual_appreciation) ** years)
    
    def calculate_total_return(self, initial_investment: float, final_value: float, total_cash_flow: float) -> float:
        """
        Calculate total return on investment
        """
        return (final_value + total_cash_flow - initial_investment) / initial_investment
    
    def calculate_annualized_return(self, total_return: float, years: int) -> float:
        """
        Calculate annualized return
        """
        if years == 0:
            return 0.0
        return (1 + total_return) ** (1 / years) - 1
    
    def interpret_results(self, cap_rate: float, cash_on_cash: float, dscr: float, local_refs: Dict[str, float] = None) -> List[str]:
        """
        Interpret ROI results and provide investment insights with local market context
        local_refs: e.g. {'cap_low':0.04, 'cap_high':0.08, 'coc_target':0.08, 'dscr_min':1.2}
        Returns list of human readable strings.
        """
        if local_refs is None:
            local_refs = {'cap_low': 0.03, 'cap_high': 0.08, 'coc_target': 0.08, 'dscr_min': 1.2}
        
        notes = []
        
        # Cap Rate Analysis with local context
        if cap_rate <= 0:
            notes.append("Cap rate could not be calculated due to missing inputs.")
        else:
            if cap_rate < local_refs.get('cap_low', 0.05):
                notes.append(f"Cap Rate {cap_rate*100:.2f}% — below local low ({local_refs.get('cap_low', 0.05)*100:.2f}%), indicates pricing leans toward appreciation instead of current income.")
            elif cap_rate > local_refs.get('cap_high', 0.08):
                notes.append(f"Cap Rate {cap_rate*100:.2f}% — higher than typical ({local_refs.get('cap_high', 0.08)*100:.2f}%), indicates strong current income or undervaluation.")
            else:
                notes.append(f"Cap Rate {cap_rate*100:.2f}% — within typical local range.")

        # Cash-on-Cash Analysis with local context
        if math.isnan(cash_on_cash):
            notes.append("Cash-on-Cash could not be calculated (missing equity or cash flow).")
        else:
            if cash_on_cash < local_refs.get('coc_target', 0.08):
                notes.append(f"Cash-on-Cash {cash_on_cash*100:.2f}% — lower than typical investor target ({local_refs.get('coc_target', 0.08)*100:.2f}%).")
            else:
                notes.append(f"Cash-on-Cash {cash_on_cash*100:.2f}% — meets investor yield targets.")

        # DSCR Analysis with local context
        if dscr < local_refs.get('dscr_min', 1.2):
            notes.append(f"DSCR {dscr:.2f} — below typical lender minimum ({local_refs.get('dscr_min', 1.2)}), financing may be harder or require higher rates.")
        else:
            notes.append(f"DSCR {dscr:.2f} — adequate coverage for typical lenders.")

        return notes
    
    def compute_roi_from_inputs(self, inputs: Dict[str, float], local_refs: Dict[str, float] = None) -> Dict[str, Any]:
        """
        Compute comprehensive ROI analysis from input parameters
        inputs keys:
           purchase_price, gross_rent_annual, vacancy_rate, operating_expenses,
           annual_mortgage_payment, equity, hold_years (int), renovation_cost (optional)
        """
        if local_refs is None:
            local_refs = {'cap_low': 0.03, 'cap_high': 0.08, 'coc_target': 0.08, 'dscr_min': 1.2, 'discount_rate': 0.10}
        
        # Extract inputs with defaults
        purchase_price = float(inputs.get('purchase_price', 0))
        gross_rent_annual = float(inputs.get('gross_rent_annual', 0))
        vacancy_rate = float(inputs.get('vacancy_rate', 0.10))
        operating_expenses = float(inputs.get('operating_expenses', 0))
        annual_mortgage_payment = float(inputs.get('annual_mortgage_payment', 0))
        equity = float(inputs.get('equity', purchase_price * 0.20))
        down_payment = inputs.get('down_payment', 0)
        loan_amount = inputs.get('loan_amount', 0)
        interest_rate = inputs.get('interest_rate', 0)
        loan_term_years = inputs.get('loan_term_years', 30)
        annual_appreciation = inputs.get('annual_appreciation', 0.03)
        hold_years = int(inputs.get('hold_years', 5))
        renovation_cost = float(inputs.get('renovation_cost', 0))
        discount_rate = inputs.get('discount_rate', local_refs.get('discount_rate', 0.10))
        
        # Calculate derived values if not provided
        if equity == 0 and down_payment > 0:
            equity = down_payment
        if loan_amount == 0 and down_payment > 0:
            loan_amount = purchase_price - down_payment
        if annual_mortgage_payment == 0 and loan_amount > 0 and interest_rate > 0:
            annual_mortgage_payment = self.calculate_annual_mortgage_payment(loan_amount, interest_rate, loan_term_years)
        
        # Core calculations
        egi = self.effective_gross_income(gross_rent_annual, vacancy_rate)
        noi = self.net_operating_income(egi, operating_expenses)
        cap_rate = self.cap_rate(noi, purchase_price)
        gross_yield = self.gross_yield(gross_rent_annual, purchase_price)
        pre_tax_cash_flow = self.pre_tax_cash_flow(noi, annual_mortgage_payment)
        cash_on_cash = self.cash_on_cash_return(pre_tax_cash_flow, equity)
        dscr = self.debt_service_coverage_ratio(noi, annual_mortgage_payment)
        
        # Projected values
        projected_value = self.calculate_property_value_appreciation(purchase_price, annual_appreciation, hold_years)
        total_cash_flow = pre_tax_cash_flow * hold_years
        
        # DCF projection with terminal value
        # CF0 = -equity - renovation_cost (initial outflow). Years 1..hold_years = pre_tax_cash_flow.
        cash_flows = [-equity - renovation_cost] + [pre_tax_cash_flow for _ in range(hold_years)]
        
        # Calculate terminal value using terminal cap rate = local cap median
        terminal_cap = (local_refs.get('cap_low', 0.03) + local_refs.get('cap_high', 0.08)) / 2
        terminal_value = noi / terminal_cap if terminal_cap > 0 else 0
        cash_flows[-1] += terminal_value  # Add terminal value to last year
        
        # Calculate NPV and IRR
        npv_val = self.net_present_value_simple(cash_flows, discount_rate)
        irr_val = self.internal_rate_of_return_simple(cash_flows)
        
        # Total returns
        total_return = self.calculate_total_return(equity, projected_value, total_cash_flow)
        annualized_return = self.calculate_annualized_return(total_return, hold_years)
        
        # Interpretation
        interpretation = self.interpret_results(cap_rate, cash_on_cash, dscr, local_refs)
        
        return {
            'egi': egi,
            'noi': noi,
            'cap_rate': cap_rate,
            'gross_yield': gross_yield,
            'pre_tax_cash_flow': pre_tax_cash_flow,
            'cash_on_cash': cash_on_cash,
            'dscr': dscr,
            'npv': npv_val,
            'irr': irr_val,
            'explanation': interpretation,
            'cash_flows': cash_flows,
            'terminal_value': terminal_value,
            'total_return': total_return,
            'annualized_return': annualized_return,
            'projected_value': projected_value,
            'total_cash_flow': total_cash_flow,
            'inputs': inputs,
            'calculated_at': datetime.now().isoformat()
        }
    
    def calculate_comprehensive_roi(self, property_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Calculate comprehensive ROI for a property with all metrics
        """
        return self.compute_roi_from_inputs(property_data)
    
    def compare_properties(self, properties: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Compare multiple properties and rank them
        """
        results = []
        
        for i, prop in enumerate(properties):
            roi_result = self.calculate_comprehensive_roi(prop)
            results.append({
                'property_id': i,
                'property_name': prop.get('property_name', f'Property {i+1}'),
                'roi_metrics': roi_result['metrics'],
                'interpretation': roi_result['interpretation']
            })
        
        # Sort by cash-on-cash return
        results.sort(key=lambda x: x['roi_metrics']['cash_on_cash'], reverse=True)
        
        return {
            'comparison_results': results,
            'best_property': results[0] if results else None,
            'comparison_date': datetime.now().isoformat()
        }
    
    def sensitivity_analysis(self, base_inputs: Dict[str, float], 
                           variable_ranges: Dict[str, List[float]]) -> Dict[str, Any]:
        """
        Perform sensitivity analysis on key variables
        """
        sensitivity_results = {}
        
        for variable, values in variable_ranges.items():
            results = []
            for value in values:
                test_inputs = base_inputs.copy()
                test_inputs[variable] = value
                roi_result = self.calculate_comprehensive_roi(test_inputs)
                results.append({
                    'value': value,
                    'cash_on_cash': roi_result['metrics']['cash_on_cash'],
                    'cap_rate': roi_result['metrics']['cap_rate'],
                    'npv': roi_result['metrics']['npv']
                })
            sensitivity_results[variable] = results
        
        return {
            'sensitivity_analysis': sensitivity_results,
            'base_case': self.calculate_comprehensive_roi(base_inputs),
            'analysis_date': datetime.now().isoformat()
        }

# Convenience functions for backward compatibility
def effective_gross_income(gross_rent_annual: float, vacancy_rate: float) -> float:
    """Calculate Effective Gross Income"""
    engine = ROIEngine()
    return engine.effective_gross_income(gross_rent_annual, vacancy_rate)

def noi(egi: float, operating_expenses: float) -> float:
    """Calculate Net Operating Income"""
    engine = ROIEngine()
    return engine.net_operating_income(egi, operating_expenses)

def cap_rate(noi: float, purchase_price: float) -> float:
    """Calculate Capitalization Rate"""
    engine = ROIEngine()
    return engine.cap_rate(noi, purchase_price)

def gross_yield(gross_rent_annual: float, purchase_price: float) -> float:
    """Calculate Gross Yield"""
    engine = ROIEngine()
    return engine.gross_yield(gross_rent_annual, purchase_price)

def pre_tax_cash_flow(noi: float, annual_mortgage_payment: float) -> float:
    """Calculate Pre-Tax Cash Flow"""
    engine = ROIEngine()
    return engine.pre_tax_cash_flow(noi, annual_mortgage_payment)

def cash_on_cash(pre_tax_cash_flow: float, equity: float) -> float:
    """Calculate Cash-on-Cash Return"""
    engine = ROIEngine()
    return engine.cash_on_cash_return(pre_tax_cash_flow, equity)

def dscr(noi: float, annual_mortgage_payment: float) -> float:
    """Calculate Debt Service Coverage Ratio"""
    engine = ROIEngine()
    return engine.debt_service_coverage_ratio(noi, annual_mortgage_payment)

def npv(cash_flows: List[float], discount_rate: float) -> float:
    """Calculate Net Present Value - simple version"""
    engine = ROIEngine()
    return engine.net_present_value_simple(cash_flows, discount_rate)

def irr(cash_flows: List[float]) -> float:
    """Calculate Internal Rate of Return - simple version"""
    engine = ROIEngine()
    return engine.internal_rate_of_return_simple(cash_flows)

def compute_roi_from_inputs(inputs: Dict[str, float], local_refs: Dict[str, float] = None) -> Dict[str, Any]:
    """Compute ROI from inputs - convenience function"""
    engine = ROIEngine()
    return engine.compute_roi_from_inputs(inputs, local_refs)

def compute_and_store_property_roi(property_id: int) -> Dict[str, float]:
    """
    Compute ROI for a stored property (placeholder for database integration)
    """
    # This would typically fetch property data from database
    # For now, return a mock result
    return {
        'cap_rate': 0.065,
        'noi': 32500.0,
        'pre_tax_cash_flow': 18500.0,
        'cash_on_cash': 0.092,
        'dscr': 1.75
    }