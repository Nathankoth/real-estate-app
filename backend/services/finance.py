from typing import Dict

def roi_metrics(purchase_price: float,
                monthly_rent: float,
                monthly_expenses: float,
                occupancy_rate: float,
                hold_years: int,
                annual_appreciation: float) -> Dict[str, float]:
    annual_rent = monthly_rent * 12 * occupancy_rate
    annual_expenses = monthly_expenses * 12
    noi = annual_rent - annual_expenses
    cap_rate = (noi / purchase_price) if purchase_price else 0.0
    annual_cash_flow = noi
    # cash_on_cash (assume cash purchase): annual cash flow / purchase price
    cash_on_cash = (annual_cash_flow / purchase_price) if purchase_price else 0.0
    # projected value after hold_years with simple compounding
    projected_value = purchase_price * ((1 + annual_appreciation) ** hold_years)
    total_rental_income = annual_rent * hold_years
    return {
        "NOI": round(noi, 2),
        "cap_rate": round(cap_rate, 4),
        "annual_cash_flow": round(annual_cash_flow, 2),
        "cash_on_cash": round(cash_on_cash, 4),
        "projected_value": round(projected_value, 2),
        "total_rental_income": round(total_rental_income, 2)
    }
