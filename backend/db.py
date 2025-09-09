# db.py
import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import RealDictCursor

load_dotenv()

DB_URL = os.getenv("DB_URL")

def get_conn():
    if not DB_URL:
        raise RuntimeError("DB_URL not set in env")
    return psycopg2.connect(DB_URL)

def fetch_property_input(property_id: int):
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, purchase_price, gross_rent_annual, vacancy_rate,
                       operating_expenses, annual_mortgage_payment, equity, hold_years, renovation_cost
                FROM property_inputs WHERE id = %s
            """, (property_id,))
            return cur.fetchone()
    finally:
        conn.close()

def save_roi_results(property_id: int, results: dict):
    conn = get_conn()
    try:
        with conn.cursor() as cur:
            cur.execute("""
                INSERT INTO property_roi_results (property_id, cap_rate, noi, cash_on_cash, dscr, pre_tax_cash_flow, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, %s, NOW(), NOW())
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
    finally:
        conn.close()
