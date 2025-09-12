"""
ROI Engine Service for Real Estate Investment Analysis
Handles comprehensive ROI calculations, cash flow analysis, and investment recommendations
"""

from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import math
import statistics

class ROIEngine:
    def __init__(self):
        self.market_data_cache = {}
        self.analysis_history = []
    
    async def calculate_comprehensive_roi(
        self, 
        property_data: Dict,
        market_data: Dict,
        user_preferences: Dict
    ) -> Dict:
        """
        Calculate comprehensive ROI analysis
        """
        try:
            # Extract property details
            purchase_price = property_data.get("purchase_price", 0)
            monthly_rent = property_data.get("monthly_rent", 0)
            down_payment = property_data.get("down_payment", 0)
            interest_rate = property_data.get("interest_rate", 0)
            loan_term = property_data.get("loan_term_years", 30)
            
            # Calculate loan details
            loan_amount = purchase_price - down_payment
            monthly_payment = self._calculate_monthly_payment(
                loan_amount, interest_rate, loan_term
            )
            
            # Calculate cash flow
            cash_flow_analysis = await self._analyze_cash_flow(
                property_data, monthly_payment, market_data
            )
            
            # Calculate ROI metrics
            roi_metrics = await self._calculate_roi_metrics(
                property_data, cash_flow_analysis, market_data
            )
            
            # Generate projections
            projections = await self._generate_projections(
                property_data, cash_flow_analysis, market_data
            )
            
            # Risk assessment
            risk_assessment = await self._assess_risk(
                property_data, cash_flow_analysis, market_data
            )
            
            # Generate recommendations
            recommendations = await self._generate_recommendations(
                property_data, cash_flow_analysis, roi_metrics, risk_assessment
            )
            
            # Market comparison
            market_comparison = await self._compare_to_market(
                property_data, market_data
            )
            
            return {
                "cash_flow_analysis": cash_flow_analysis,
                "roi_metrics": roi_metrics,
                "projections": projections,
                "risk_assessment": risk_assessment,
                "recommendations": recommendations,
                "market_comparison": market_comparison,
                "analysis_timestamp": datetime.utcnow().isoformat(),
                "property_id": property_data.get("id", "unknown")
            }
            
        except Exception as e:
            raise Exception(f"ROI calculation failed: {str(e)}")
    
    def _calculate_monthly_payment(
        self, 
        principal: float, 
        annual_rate: float, 
        years: int
    ) -> float:
        """Calculate monthly mortgage payment"""
        if principal <= 0:
            return 0
        
        monthly_rate = annual_rate / 100 / 12
        num_payments = years * 12
        
        if monthly_rate == 0:
            return principal / num_payments
        
        monthly_payment = principal * (
            monthly_rate * (1 + monthly_rate) ** num_payments
        ) / ((1 + monthly_rate) ** num_payments - 1)
        
        return monthly_payment
    
    async def _analyze_cash_flow(
        self, 
        property_data: Dict, 
        monthly_payment: float, 
        market_data: Dict
    ) -> Dict:
        """Analyze monthly and annual cash flow"""
        
        # Income
        gross_rent = property_data.get("monthly_rent", 0)
        vacancy_rate = market_data.get("vacancy_rate", 5) / 100
        net_rent = gross_rent * (1 - vacancy_rate)
        
        # Expenses
        monthly_expenses = {
            "mortgage_payment": monthly_payment,
            "property_tax": (property_data.get("purchase_price", 0) * 
                           property_data.get("property_tax_rate", 1.2) / 100) / 12,
            "insurance": (property_data.get("purchase_price", 0) * 
                        property_data.get("insurance_rate", 0.5) / 100) / 12,
            "maintenance": (property_data.get("purchase_price", 0) * 
                          property_data.get("maintenance_rate", 1.0) / 100) / 12,
            "property_management": gross_rent * 0.08,  # 8% of gross rent
            "utilities": property_data.get("monthly_utilities", 0),
            "other_expenses": property_data.get("monthly_other_expenses", 0)
        }
        
        total_monthly_expenses = sum(monthly_expenses.values())
        monthly_cash_flow = net_rent - total_monthly_expenses
        
        # Annual calculations
        annual_cash_flow = monthly_cash_flow * 12
        annual_rental_income = net_rent * 12
        annual_expenses = total_monthly_expenses * 12
        
        return {
            "monthly": {
                "gross_rent": gross_rent,
                "net_rent": net_rent,
                "vacancy_allowance": gross_rent * vacancy_rate,
                "expenses": monthly_expenses,
                "total_expenses": total_monthly_expenses,
                "cash_flow": monthly_cash_flow
            },
            "annual": {
                "gross_rent": gross_rent * 12,
                "net_rent": annual_rental_income,
                "expenses": {k: v * 12 for k, v in monthly_expenses.items()},
                "total_expenses": annual_expenses,
                "cash_flow": annual_cash_flow
            }
        }
    
    async def _calculate_roi_metrics(
        self, 
        property_data: Dict, 
        cash_flow: Dict, 
        market_data: Dict
    ) -> Dict:
        """Calculate key ROI metrics"""
        
        purchase_price = property_data.get("purchase_price", 0)
        down_payment = property_data.get("down_payment", 0)
        annual_cash_flow = cash_flow["annual"]["cash_flow"]
        
        # Cash-on-Cash Return
        cash_on_cash = (annual_cash_flow / down_payment * 100) if down_payment > 0 else 0
        
        # Cap Rate
        cap_rate = (annual_cash_flow / purchase_price * 100) if purchase_price > 0 else 0
        
        # Gross Rent Multiplier
        annual_gross_rent = cash_flow["annual"]["gross_rent"]
        grm = purchase_price / annual_gross_rent if annual_gross_rent > 0 else 0
        
        # Return on Investment (Total)
        appreciation_rate = market_data.get("appreciation_rate", 3) / 100
        hold_period = property_data.get("hold_period_years", 5)
        
        future_value = purchase_price * ((1 + appreciation_rate) ** hold_period)
        total_appreciation = future_value - purchase_price
        total_cash_flow = annual_cash_flow * hold_period
        total_return = total_cash_flow + total_appreciation
        
        total_roi = (total_return / down_payment * 100) if down_payment > 0 else 0
        
        # Internal Rate of Return (simplified)
        irr = self._calculate_irr(property_data, cash_flow, hold_period, future_value)
        
        return {
            "cash_on_cash_return": round(cash_on_cash, 2),
            "cap_rate": round(cap_rate, 2),
            "gross_rent_multiplier": round(grm, 2),
            "total_roi": round(total_roi, 2),
            "internal_rate_of_return": round(irr, 2),
            "total_appreciation": round(total_appreciation, 2),
            "future_property_value": round(future_value, 2)
        }
    
    def _calculate_irr(
        self, 
        property_data: Dict, 
        cash_flow: Dict, 
        hold_period: int, 
        future_value: float
    ) -> float:
        """Calculate Internal Rate of Return (simplified)"""
        try:
            # Initial investment (negative cash flow)
            initial_investment = -property_data.get("down_payment", 0)
            
            # Annual cash flows
            annual_cash_flow = cash_flow["annual"]["cash_flow"]
            
            # Final cash flow (sale proceeds)
            final_cash_flow = future_value - property_data.get("purchase_price", 0)
            
            # Use Newton-Raphson method for IRR calculation
            rate = 0.1  # Initial guess
            for _ in range(100):  # Max iterations
                npv = initial_investment
                npv_derivative = 0
                
                for year in range(1, hold_period + 1):
                    npv += annual_cash_flow / ((1 + rate) ** year)
                    npv_derivative -= year * annual_cash_flow / ((1 + rate) ** (year + 1))
                
                npv += final_cash_flow / ((1 + rate) ** hold_period)
                npv_derivative -= hold_period * final_cash_flow / ((1 + rate) ** (hold_period + 1))
                
                if abs(npv) < 0.01:  # Convergence
                    break
                
                if npv_derivative == 0:
                    break
                
                rate = rate - npv / npv_derivative
            
            return rate * 100  # Convert to percentage
            
        except:
            return 0.0  # Return 0 if calculation fails
    
    async def _generate_projections(
        self, 
        property_data: Dict, 
        cash_flow: Dict, 
        market_data: Dict
    ) -> Dict:
        """Generate future projections"""
        
        projections = {}
        current_rent = property_data.get("monthly_rent", 0)
        rent_growth_rate = market_data.get("rent_growth_rate", 2) / 100
        appreciation_rate = market_data.get("appreciation_rate", 3) / 100
        
        for year in [1, 3, 5, 10]:
            # Projected rent
            projected_rent = current_rent * ((1 + rent_growth_rate) ** year)
            
            # Projected property value
            projected_value = property_data.get("purchase_price", 0) * ((1 + appreciation_rate) ** year)
            
            # Projected cash flow (simplified - assumes expenses grow with inflation)
            inflation_rate = 2.5 / 100
            expense_multiplier = (1 + inflation_rate) ** year
            projected_expenses = cash_flow["monthly"]["total_expenses"] * expense_multiplier
            projected_cash_flow = projected_rent - projected_expenses
            
            projections[f"year_{year}"] = {
                "projected_rent": round(projected_rent, 2),
                "projected_value": round(projected_value, 2),
                "projected_monthly_cash_flow": round(projected_cash_flow, 2),
                "projected_annual_cash_flow": round(projected_cash_flow * 12, 2),
                "total_equity": round(projected_value - property_data.get("purchase_price", 0), 2)
            }
        
        return projections
    
    async def _assess_risk(
        self, 
        property_data: Dict, 
        cash_flow: Dict, 
        market_data: Dict
    ) -> Dict:
        """Assess investment risk factors"""
        
        risk_factors = []
        risk_score = 0
        
        # Cash flow risk
        monthly_cash_flow = cash_flow["monthly"]["cash_flow"]
        if monthly_cash_flow < 0:
            risk_factors.append("Negative cash flow")
            risk_score += 30
        elif monthly_cash_flow < 200:
            risk_factors.append("Low cash flow margin")
            risk_score += 15
        
        # Market risk
        vacancy_rate = market_data.get("vacancy_rate", 5)
        if vacancy_rate > 10:
            risk_factors.append("High vacancy rate")
            risk_score += 20
        
        # Leverage risk
        down_payment_ratio = property_data.get("down_payment", 0) / property_data.get("purchase_price", 1)
        if down_payment_ratio < 0.2:
            risk_factors.append("High leverage")
            risk_score += 15
        
        # Interest rate risk
        interest_rate = property_data.get("interest_rate", 0)
        if interest_rate > 6:
            risk_factors.append("High interest rate")
            risk_score += 10
        
        # Location risk (simplified)
        location_score = market_data.get("location_score", 70)
        if location_score < 60:
            risk_factors.append("Challenging location")
            risk_score += 20
        
        # Determine risk level
        if risk_score < 20:
            risk_level = "Low"
        elif risk_score < 40:
            risk_level = "Medium"
        else:
            risk_level = "High"
        
        return {
            "risk_level": risk_level,
            "risk_score": risk_score,
            "risk_factors": risk_factors,
            "mitigation_strategies": self._get_mitigation_strategies(risk_factors)
        }
    
    def _get_mitigation_strategies(self, risk_factors: List[str]) -> List[str]:
        """Get risk mitigation strategies"""
        strategies = []
        
        for factor in risk_factors:
            if "Negative cash flow" in factor:
                strategies.append("Consider increasing rent or reducing expenses")
            elif "High vacancy" in factor:
                strategies.append("Research local rental demand and market conditions")
            elif "High leverage" in factor:
                strategies.append("Consider increasing down payment or finding lower-priced properties")
            elif "High interest rate" in factor:
                strategies.append("Shop around for better rates or consider waiting for rate drops")
            elif "Challenging location" in factor:
                strategies.append("Research area development plans and economic indicators")
        
        return strategies
    
    async def _generate_recommendations(
        self, 
        property_data: Dict, 
        cash_flow: Dict, 
        roi_metrics: Dict, 
        risk_assessment: Dict
    ) -> List[str]:
        """Generate investment recommendations"""
        
        recommendations = []
        
        # ROI-based recommendations
        if roi_metrics["cash_on_cash_return"] < 8:
            recommendations.append("Consider negotiating a lower purchase price or higher rent")
        
        if roi_metrics["cap_rate"] < 6:
            recommendations.append("This property may not provide optimal returns compared to alternatives")
        
        # Cash flow recommendations
        if cash_flow["monthly"]["cash_flow"] < 0:
            recommendations.append("Ensure you can cover monthly cash flow shortfall")
        
        # Risk-based recommendations
        if risk_assessment["risk_level"] == "High":
            recommendations.append("High-risk investment - ensure you have adequate reserves")
        
        # Market-based recommendations
        if property_data.get("monthly_rent", 0) / property_data.get("purchase_price", 1) * 12 < 0.06:
            recommendations.append("Rent-to-price ratio is low - consider market rent potential")
        
        # General recommendations
        recommendations.extend([
            "Conduct thorough property inspection",
            "Verify all financial assumptions with current market data",
            "Consider property management costs in your analysis",
            "Plan for unexpected maintenance and vacancy periods"
        ])
        
        return recommendations
    
    async def _compare_to_market(
        self, 
        property_data: Dict, 
        market_data: Dict
    ) -> Dict:
        """Compare property to market averages"""
        
        property_metrics = {
            "price_per_sqft": property_data.get("purchase_price", 0) / property_data.get("sqft", 1),
            "rent_per_sqft": property_data.get("monthly_rent", 0) / property_data.get("sqft", 1),
            "rent_to_price_ratio": property_data.get("monthly_rent", 0) * 12 / property_data.get("purchase_price", 1)
        }
        
        market_metrics = {
            "avg_price_per_sqft": market_data.get("avg_price_per_sqft", 200),
            "avg_rent_per_sqft": market_data.get("avg_rent_per_sqft", 1.5),
            "avg_rent_to_price_ratio": market_data.get("avg_rent_to_price_ratio", 0.07)
        }
        
        comparison = {}
        for metric in property_metrics:
            property_value = property_metrics[metric]
            market_value = market_metrics.get(f"avg_{metric}", 0)
            
            if market_value > 0:
                variance = ((property_value - market_value) / market_value) * 100
                comparison[metric] = {
                    "property_value": round(property_value, 2),
                    "market_average": round(market_value, 2),
                    "variance_percent": round(variance, 2),
                    "status": "above_market" if variance > 5 else "below_market" if variance < -5 else "market_rate"
                }
        
        return comparison

# Global ROI engine instance
roi_engine = ROIEngine()
