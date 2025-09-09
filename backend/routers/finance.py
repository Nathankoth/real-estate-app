from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.openai_service import ask_text
from roi_engine import (
    effective_gross_income, noi, cap_rate, gross_yield,
    pre_tax_cash_flow, cash_on_cash, dscr
)
from utils.currency import format_currency, format_percentage

router = APIRouter()

class FinanceRequest(BaseModel):
    purchase_price: float
    monthly_rent: float
    monthly_expenses: float
    occupancy_rate: float = 0.9
    hold_years: int = 5
    annual_appreciation: float = 0.03
    currency: Optional[str] = "USD"

@router.post("/roi")
async def calculate_roi(req: FinanceRequest):
    """
    Calculate comprehensive ROI metrics with AI analysis
    """
    try:
        # Convert monthly to annual values
        annual_rent = req.monthly_rent * 12 * req.occupancy_rate
        annual_expenses = req.monthly_expenses * 12
        
        # Calculate comprehensive metrics
        egi = effective_gross_income(annual_rent, 1 - req.occupancy_rate)  # vacancy_rate = 1 - occupancy_rate
        noi_value = noi(egi, annual_expenses)
        cap = cap_rate(noi_value, req.purchase_price)
        gross_yield_value = gross_yield(annual_rent, req.purchase_price)
        
        # For cash-on-cash, assume cash purchase (equity = purchase_price)
        pre_cf = pre_tax_cash_flow(noi_value, 0)  # No mortgage payment for cash purchase
        coc = cash_on_cash(pre_cf, req.purchase_price)
        
        # Calculate projected value
        projected_value = req.purchase_price * ((1 + req.annual_appreciation) ** req.hold_years)
        total_rental_income = annual_rent * req.hold_years
        
        metrics = {
            "NOI": round(noi_value, 2),
            "cap_rate": round(cap, 4),
            "annual_cash_flow": round(pre_cf, 2),
            "cash_on_cash": round(coc, 4),
            "gross_yield": round(gross_yield_value, 4),
            "projected_value": round(projected_value, 2),
            "total_rental_income": round(total_rental_income, 2)
        }
        
        # Ask LLM for a short summary/explanation based on metrics
        summary_prompt = (
            f"Given these metrics for a property priced {req.purchase_price} {req.currency}, "
            f"monthly rent {req.monthly_rent}, monthly expenses {req.monthly_expenses}, occupancy {req.occupancy_rate}, "
            f"and expected annual appreciation {req.annual_appreciation}, provide a short (3-5 lines) investor summary and key risks."
        )
        summary = ask_text("You are an investment analyst.", summary_prompt, model="gpt-4")
        
        return {
            "capRate": cap,
            "NOI": noi_value,
            "analysis": summary  # make sure this is passed back!
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"ROI calculation error: {str(e)}")
