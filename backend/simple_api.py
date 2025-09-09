from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="ROI Calculator API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ROIRequest(BaseModel):
    purchase_price: float
    annual_rent: float
    vacancy_rate: float = 10.0
    operating_expenses: float
    mortgage_payment: float = 0.0
    equity: float = 0.0
    hold_period: int = 5
    renovation_cost: float = 0.0
    cap_rate_low: float = 3.0
    cap_rate_high: float = 8.0
    cash_on_cash_target: float = 8.0
    dscr_minimum: float = 1.2

class ROIResponse(BaseModel):
    roi: float
    net_income: float
    cash_flow: float
    payback_period: float
    cap_rate: float
    cash_on_cash: float
    dscr: float
    analysis: str

@app.get("/")
def root():
    return {"message": "ROI Calculator API is running!", "version": "1.0.0"}

@app.post("/calculate-roi", response_model=ROIResponse)
def calculate_roi(data: ROIRequest):
    # Calculate effective gross income (after vacancy)
    effective_gross_income = data.annual_rent * (1 - data.vacancy_rate/100)
    
    # Calculate net operating income
    net_income = effective_gross_income - data.operating_expenses
    
    # Calculate cash flow (after mortgage payment)
    cash_flow = net_income - data.mortgage_payment
    
    # Calculate ROI
    total_investment = data.purchase_price + data.renovation_cost
    roi = (cash_flow / total_investment) * 100
    
    # Calculate payback period
    payback_period = total_investment / cash_flow if cash_flow > 0 else 0
    
    # Calculate cap rate
    cap_rate = (net_income / data.purchase_price) * 100
    
    # Calculate cash-on-cash return
    cash_on_cash = (cash_flow / data.equity) * 100 if data.equity > 0 else 0
    
    # Calculate DSCR (Debt Service Coverage Ratio)
    dscr = net_income / data.mortgage_payment if data.mortgage_payment > 0 else 0
    
    # Generate analysis
    analysis_parts = []
    
    if roi >= data.cash_on_cash_target:
        analysis_parts.append(f"✅ Excellent ROI of {roi:.2f}% exceeds your target of {data.cash_on_cash_target}%")
    elif roi >= data.cash_on_cash_target * 0.8:
        analysis_parts.append(f"✅ Good ROI of {roi:.2f}% is close to your target of {data.cash_on_cash_target}%")
    else:
        analysis_parts.append(f"⚠️ ROI of {roi:.2f}% is below your target of {data.cash_on_cash_target}%")
    
    if cap_rate >= data.cap_rate_low and cap_rate <= data.cap_rate_high:
        analysis_parts.append(f"✅ Cap rate of {cap_rate:.2f}% is within the typical range ({data.cap_rate_low}-{data.cap_rate_high}%)")
    elif cap_rate < data.cap_rate_low:
        analysis_parts.append(f"⚠️ Cap rate of {cap_rate:.2f}% is below typical range - may indicate overpricing")
    else:
        analysis_parts.append(f"✅ Cap rate of {cap_rate:.2f}% is above typical range - strong income potential")
    
    if dscr >= data.dscr_minimum:
        analysis_parts.append(f"✅ DSCR of {dscr:.2f} meets lender requirements (≥{data.dscr_minimum})")
    else:
        analysis_parts.append(f"⚠️ DSCR of {dscr:.2f} is below lender minimum ({data.dscr_minimum}) - financing may be difficult")
    
    if payback_period <= 10:
        analysis_parts.append(f"✅ Payback period of {payback_period:.1f} years is reasonable")
    else:
        analysis_parts.append(f"⚠️ Payback period of {payback_period:.1f} years is quite long")
    
    analysis = " | ".join(analysis_parts)
    
    return ROIResponse(
        roi=round(roi, 2),
        net_income=round(net_income, 2),
        cash_flow=round(cash_flow, 2),
        payback_period=round(payback_period, 1),
        cap_rate=round(cap_rate, 2),
        cash_on_cash=round(cash_on_cash, 2),
        dscr=round(dscr, 2),
        analysis=analysis
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
