"""
roi_engine.py
Simple ROI calculator functions and DB integration (Postgres + psycopg2)
"""

import psycopg2
from psycopg2.extras import RealDictCursor
import math
from typing import Dict, Any, List
import numpy as np

# Optional: pip install numpy-financial to compute IRR/NPV robustly
# import numpy_financial as nf

# ---------- Core financial functions ----------
def effective_gross_income(gross_rent_annual: float, vacancy_rate: float) -> float:
    return gross_rent_annual * (1.0 - vacancy_rate)

def noi(egi: float, operating_expenses: float) -> float:
    return egi - operating_expenses

def cap_rate(noi_value: float, purchase_price: float) -> float:
    return 0.0 if purchase_price == 0 else noi_value / purchase_price

def gross_yield(gross_rent_annual: float, purchase_price: float) -> float:
    return 0.0 if purchase_price == 0 else gross_rent_annual / purchase_price

def pre_tax_cash_flow(noi_value: float, annual_mortgage_payment: float) -> float:
    return noi_value - annual_mortgage_payment

def cash_on_cash(pre_tax_cf: float, equity: float) -> float:
    return 0.0 if equity == 0 else pre_tax_cf / equity

def dscr(noi_value: float, annual_mortgage_payment: float) -> float:
    return 0.0 if annual_mortgage_payment == 0 else noi_value / annual_mortgage_payment

# Basic DCF NPV and IRR
def npv(cash_flows: List[float], discount_rate: float) -> float:
    """cash_flows: list of CFs with CF0 being initial outflow (negative equity)"""
    return sum(cf / ((1.0 + discount_rate) ** i) for i, cf in enumerate(cash_flows))

def irr(cash_flows: List[float], guess: float=0.1) -> float:
    """Simple IRR via numpy.roots on polynomial of CFs"""
    # If numpy-financial is available, use nf.irr
    try:
        import numpy_financial as nf
        return nf.irr(cash_flows)
    except Exception:
        # fallback: numpy polynomial root method (may be less robust)
        coeffs = list(reversed(cash_flows))
        roots = np.roots(coeffs)
        real_roots = [r.real for r in roots if abs(r.imag) < 1e-6 and r.real > -0.9999]
        return real_roots[0] if real_roots else float('nan')

# ---------- DB utilities ----------
from database_config import get_db_connection

def fetch_property_inputs(conn, property_id: int) -> Dict[str, Any]:
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute("""
            SELECT id, purchase_price, gross_rent_annual, vacancy_rate,
                   operating_expenses, annual_mortgage_payment, equity
            FROM property_inputs WHERE id = %s
        """, (property_id,))
        return cur.fetchone()

def save_roi_results(conn, property_id: int, results: Dict[str, Any]):
    with conn.cursor() as cur:
        cur.execute("""
            INSERT INTO property_roi_results (property_id, cap_rate, noi, cash_on_cash, dscr, pre_tax_cash_flow)
            VALUES (%s, %s, %s, %s, %s, %s)
            ON CONFLICT (property_id) DO UPDATE
            SET cap_rate = EXCLUDED.cap_rate, noi = EXCLUDED.noi, cash_on_cash = EXCLUDED.cash_on_cash,
                dscr = EXCLUDED.dscr, pre_tax_cash_flow = EXCLUDED.pre_tax_cash_flow, updated_at = NOW()
        """, (
            property_id,
            results.get("cap_rate"),
            results.get("noi"),
            results.get("cash_on_cash"),
            results.get("dscr"),
            results.get("pre_tax_cash_flow")
        ))
        conn.commit()

# ---------- Orchestration ----------
def compute_and_store_property_roi(property_id: int):
    conn = get_db_connection()
    try:
        data = fetch_property_inputs(conn, property_id)
        if not data:
            raise ValueError("Property not found")

        egi_val = effective_gross_income(data["gross_rent_annual"], data["vacancy_rate"])
        noi_val = noi(egi_val, data["operating_expenses"])
        cap = cap_rate(noi_val, data["purchase_price"])
        pre_cf = pre_tax_cash_flow(noi_val, data["annual_mortgage_payment"])
        coc = cash_on_cash(pre_cf, data["equity"])
        dscr_val = dscr(noi_val, data["annual_mortgage_payment"])

        results = {
            "cap_rate": cap,
            "noi": noi_val,
            "pre_tax_cash_flow": pre_cf,
            "cash_on_cash": coc,
            "dscr": dscr_val
        }
        save_roi_results(conn, property_id, results)
        return results
    finally:
        conn.close()

# Example invocation:
# print(compute_and_store_property_roi(1))

def interpret_results(cap: float, coc: float, dscr_val: float, local_refs: Dict[str, float]) -> List[str]:
    """
    local_refs: e.g. {'cap_low':0.04, 'cap_high':0.08, 'coc_target':0.08, 'dscr_min':1.2}
    Returns list of human readable strings.
    """
    notes = []
    if cap <= 0:
        notes.append("Cap rate could not be calculated due to missing inputs.")
    else:
        if cap < local_refs.get('cap_low', 0.05):
            notes.append(f"Cap Rate {cap*100:.2f}% — below local low ({local_refs.get('cap_low')*100:.2f}%), indicates pricing leans toward appreciation instead of current income.")
        elif cap > local_refs.get('cap_high', 0.08):
            notes.append(f"Cap Rate {cap*100:.2f}% — higher than typical ({local_refs.get('cap_high')*100:.2f}%), indicates strong current income or undervaluation.")
        else:
            notes.append(f"Cap Rate {cap*100:.2f}% — within typical local range.")

    if math.isnan(coc):
        notes.append("Cash-on-Cash could not be calculated (missing equity or cash flow).")
    else:
        if coc < local_refs.get('coc_target', 0.08):
            notes.append(f"Cash-on-Cash {coc*100:.2f}% — lower than typical investor target ({local_refs.get('coc_target')*100:.2f}%).")
        else:
            notes.append(f"Cash-on-Cash {coc*100:.2f}% — meets investor yield targets.")

    if dscr_val < local_refs.get('dscr_min', 1.2):
        notes.append(f"DSCR {dscr_val:.2f} — below typical lender minimum ({local_refs.get('dscr_min')}), financing may be harder or require higher rates.")
    else:
        notes.append(f"DSCR {dscr_val:.2f} — adequate coverage for typical lenders.")

    return notes

def compute_roi_from_inputs(inputs: Dict[str, float], local_refs: Dict[str, float] = None) -> Dict[str, Any]:
    """
    inputs keys:
       purchase_price, gross_rent_annual, vacancy_rate, operating_expenses,
       annual_mortgage_payment, equity, hold_years (int), renovation_cost (optional)
    """
    if local_refs is None:
        local_refs = {'cap_low': 0.03, 'cap_high': 0.08, 'coc_target': 0.08, 'dscr_min': 1.2, 'discount_rate': 0.10}
    
    purchase_price = float(inputs.get('purchase_price', 0))
    gross_rent_annual = float(inputs.get('gross_rent_annual', 0))
    vacancy_rate = float(inputs.get('vacancy_rate', 0.10))
    operating_expenses = float(inputs.get('operating_expenses', 0))
    annual_mortgage_payment = float(inputs.get('annual_mortgage_payment', 0))
    equity = float(inputs.get('equity', purchase_price * 0.20))
    hold_years = int(inputs.get('hold_years', 5))
    renovation_cost = float(inputs.get('renovation_cost', 0))

    egi_val = effective_gross_income(gross_rent_annual, vacancy_rate)
    noi_val = noi(egi_val, operating_expenses)
    cap = cap_rate(noi_val, purchase_price)
    gross_y = gross_yield(gross_rent_annual, purchase_price)
    pre_cf = pre_tax_cash_flow(noi_val, annual_mortgage_payment)
    coc = cash_on_cash(pre_cf, equity)
    dscr_val = dscr(noi_val, annual_mortgage_payment)

    # simple DCF projection example (no growth assumed, you can expand)
    # CF0 = -equity - renovation_cost (initial outflow). Years 1..hold_years = pre_cf.
    cash_flows = [-equity - renovation_cost] + [pre_cf for _ in range(hold_years)]
    # assume terminal value using terminal cap rate = local cap median
    terminal_cap = (local_refs.get('cap_low') + local_refs.get('cap_high'))/2 or 0.05
    tv = noi_val / terminal_cap if terminal_cap else 0
    cash_flows[-1] += tv  # add terminal value to last year
    npv_val = npv(cash_flows, local_refs.get('discount_rate', 0.10))
    irr_val = irr(cash_flows)

    explanation = interpret_results(cap, coc, dscr_val, local_refs)

    return {
        "egi": egi_val,
        "noi": noi_val,
        "cap_rate": cap,
        "gross_yield": gross_y,
        "pre_tax_cash_flow": pre_cf,
        "cash_on_cash": coc,
        "dscr": dscr_val,
        "npv": npv_val,
        "irr": irr_val,
        "explanation": explanation,
        "cash_flows": cash_flows,
        "terminal_value": tv
    }
