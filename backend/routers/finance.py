from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from services.finance import roi_metrics
from services.openai_service import ask_text

router = APIRouter()

class FinanceRequest(BaseModel):
    purchase_price: float
    monthly_rent: float
    monthly_expenses: float
    occupancy_rate: float = 0.9
    hold_years: int = 5
    annual_appreciation: float = 0.03
    currency: Optional[str] = "NGN"

@router.post("/roi")
async def calculate_roi(req: FinanceRequest):
    metrics = roi_metrics(
        purchase_price=req.purchase_price,
        monthly_rent=req.monthly_rent,
        monthly_expenses=req.monthly_expenses,
        occupancy_rate=req.occupancy_rate,
        hold_years=req.hold_years,
        annual_appreciation=req.annual_appreciation
    )
    # Ask LLM for a short summary/explanation based on metrics
    summary_prompt = (
        f"Given these metrics for a property priced {req.purchase_price} {req.currency}, "
        f"monthly rent {req.monthly_rent}, monthly expenses {req.monthly_expenses}, occupancy {req.occupancy_rate}, "
        f"and expected annual appreciation {req.annual_appreciation}, provide a short (3-5 lines) investor summary and key risks."
    )
    summary = ask_text("You are an investment analyst.", summary_prompt, model="gpt-4.1")
    return {"metrics": metrics, "summary": summary}
