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
