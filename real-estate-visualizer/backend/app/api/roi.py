from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime
import math

router = APIRouter(prefix="/api/roi", tags=["roi"])

class ROICalculationRequest(BaseModel):
    property_value: float
    purchase_price: float
    monthly_rent: float
    monthly_expenses: float
    down_payment: float
    interest_rate: float
    loan_term_years: int
    property_tax_rate: float
    insurance_rate: float
    maintenance_rate: float
    vacancy_rate: float
    appreciation_rate: float
    hold_period_years: int
    location: str
    property_type: str

class ROIAnalysisResponse(BaseModel):
    cash_flow: Dict[str, float]
    roi_metrics: Dict[str, float]
    projections: Dict[str, Any]
    recommendations: List[str]
    risk_assessment: Dict[str, Any]

@router.post("/calculate", response_model=ROIAnalysisResponse)
async def calculate_roi(request: ROICalculationRequest):
    """
    Calculate comprehensive ROI analysis for real estate investment
    """
    try:
        # Calculate loan details
        loan_amount = request.purchase_price - request.down_payment
        monthly_interest_rate = request.interest_rate / 100 / 12
        total_payments = request.loan_term_years * 12
        
        # Monthly mortgage payment
        if loan_amount > 0:
            monthly_mortgage = loan_amount * (
                monthly_interest_rate * (1 + monthly_interest_rate) ** total_payments
            ) / ((1 + monthly_interest_rate) ** total_payments - 1)
        else:
            monthly_mortgage = 0
        
        # Monthly expenses breakdown
        monthly_property_tax = (request.purchase_price * request.property_tax_rate / 100) / 12
        monthly_insurance = (request.purchase_price * request.insurance_rate / 100) / 12
        monthly_maintenance = (request.purchase_price * request.maintenance_rate / 100) / 12
        
        # Total monthly expenses
        total_monthly_expenses = (
            monthly_mortgage + 
            monthly_property_tax + 
            monthly_insurance + 
            monthly_maintenance + 
            request.monthly_expenses
        )
        
        # Cash flow calculations
        gross_monthly_rent = request.monthly_rent
        vacancy_allowance = gross_monthly_rent * (request.vacancy_rate / 100)
        net_monthly_rent = gross_monthly_rent - vacancy_allowance
        monthly_cash_flow = net_monthly_rent - total_monthly_expenses
        
        # Annual calculations
        annual_cash_flow = monthly_cash_flow * 12
        annual_rental_income = net_monthly_rent * 12
        annual_expenses = total_monthly_expenses * 12
        
        # ROI metrics
        cash_on_cash_return = (annual_cash_flow / request.down_payment) * 100 if request.down_payment > 0 else 0
        cap_rate = (annual_cash_flow / request.purchase_price) * 100
        gross_rent_multiplier = request.purchase_price / annual_rental_income if annual_rental_income > 0 else 0
        
        # Future value calculations
        future_property_value = request.purchase_price * ((1 + request.appreciation_rate / 100) ** request.hold_period_years)
        total_equity_gain = future_property_value - request.purchase_price
        
        # Projections
        projections = {
            "year_1": {
                "property_value": request.purchase_price * (1 + request.appreciation_rate / 100),
                "annual_cash_flow": annual_cash_flow,
                "total_return": annual_cash_flow + (request.purchase_price * request.appreciation_rate / 100)
            },
            "year_5": {
                "property_value": request.purchase_price * ((1 + request.appreciation_rate / 100) ** 5),
                "annual_cash_flow": annual_cash_flow,
                "total_return": annual_cash_flow * 5 + (request.purchase_price * ((1 + request.appreciation_rate / 100) ** 5) - request.purchase_price)
            },
            "year_10": {
                "property_value": request.purchase_price * ((1 + request.appreciation_rate / 100) ** 10),
                "annual_cash_flow": annual_cash_flow,
                "total_return": annual_cash_flow * 10 + (request.purchase_price * ((1 + request.appreciation_rate / 100) ** 10) - request.purchase_price)
            }
        }
        
        # Generate recommendations
        recommendations = []
        if cash_on_cash_return < 8:
            recommendations.append("Consider negotiating a lower purchase price or higher rent to improve cash flow")
        if cap_rate < 6:
            recommendations.append("This property may not provide optimal returns compared to market alternatives")
        if vacancy_rate > 10:
            recommendations.append("High vacancy rate suggests market challenges - research local rental demand")
        if monthly_cash_flow < 0:
            recommendations.append("Negative cash flow detected - ensure you can cover monthly shortfall")
        
        # Risk assessment
        risk_factors = []
        risk_score = 0
        
        if monthly_cash_flow < 0:
            risk_factors.append("Negative cash flow")
            risk_score += 30
        if vacancy_rate > 15:
            risk_factors.append("High vacancy risk")
            risk_score += 20
        if request.interest_rate > 7:
            risk_factors.append("High interest rate environment")
            risk_score += 15
        if request.down_payment < request.purchase_price * 0.2:
            risk_factors.append("Low down payment")
            risk_score += 10
        
        risk_level = "Low" if risk_score < 20 else "Medium" if risk_score < 40 else "High"
        
        return ROIAnalysisResponse(
            cash_flow={
                "monthly_cash_flow": round(monthly_cash_flow, 2),
                "annual_cash_flow": round(annual_cash_flow, 2),
                "monthly_rent": round(net_monthly_rent, 2),
                "monthly_expenses": round(total_monthly_expenses, 2),
                "vacancy_allowance": round(vacancy_allowance, 2)
            },
            roi_metrics={
                "cash_on_cash_return": round(cash_on_cash_return, 2),
                "cap_rate": round(cap_rate, 2),
                "gross_rent_multiplier": round(gross_rent_multiplier, 2),
                "total_equity_gain": round(total_equity_gain, 2),
                "future_property_value": round(future_property_value, 2)
            },
            projections=projections,
            recommendations=recommendations,
            risk_assessment={
                "risk_level": risk_level,
                "risk_score": risk_score,
                "risk_factors": risk_factors
            }
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"ROI calculation error: {str(e)}")

@router.get("/market-data/{location}")
async def get_market_data(location: str):
    """
    Get market data for ROI calculations
    """
    try:
        # TODO: Integrate with real market data API
        # For now, return sample data
        sample_data = {
            "location": location,
            "average_rent": 2500,
            "average_property_value": 450000,
            "vacancy_rate": 5.2,
            "appreciation_rate": 3.5,
            "property_tax_rate": 1.2,
            "last_updated": datetime.now().isoformat()
        }
        
        return sample_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
