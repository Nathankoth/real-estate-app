"""
roi.py
FastAPI router for ROI calculations and property management
"""

from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict, Any, List, Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from database_config import get_db_connection
from roi_engine import (
    effective_gross_income, noi, cap_rate, gross_yield,
    pre_tax_cash_flow, cash_on_cash, dscr, npv, irr,
    compute_and_store_property_roi
)

router = APIRouter(prefix="/roi", tags=["ROI Calculator"])

# Pydantic models for request/response
class PropertyInput(BaseModel):
    purchase_price: float
    gross_rent_annual: float
    vacancy_rate: float = 0.05  # Default 5% vacancy rate
    operating_expenses: float
    annual_mortgage_payment: float
    equity: float

class PropertyInputResponse(BaseModel):
    id: int
    purchase_price: float
    gross_rent_annual: float
    vacancy_rate: float
    operating_expenses: float
    annual_mortgage_payment: float
    equity: float
    created_at: str

class ROICalculation(BaseModel):
    property_id: int
    cap_rate: float
    noi: float
    gross_yield: float
    pre_tax_cash_flow: float
    cash_on_cash: float
    dscr: float
    effective_gross_income: float

class ROICalculationRequest(BaseModel):
    purchase_price: float
    gross_rent_annual: float
    vacancy_rate: float = 0.05
    operating_expenses: float
    annual_mortgage_payment: float
    equity: float

@router.post("/calculate", response_model=ROICalculation)
async def calculate_roi(request: ROICalculationRequest):
    """
    Calculate ROI metrics for a property without storing in database
    """
    try:
        # Calculate all metrics
        egi = effective_gross_income(request.gross_rent_annual, request.vacancy_rate)
        noi_value = noi(egi, request.operating_expenses)
        cap = cap_rate(noi_value, request.purchase_price)
        gross_yield_value = gross_yield(request.gross_rent_annual, request.purchase_price)
        pre_cf = pre_tax_cash_flow(noi_value, request.annual_mortgage_payment)
        coc = cash_on_cash(pre_cf, request.equity)
        dscr_value = dscr(noi_value, request.annual_mortgage_payment)

        return ROICalculation(
            property_id=0,  # Not stored in DB
            cap_rate=round(cap * 100, 2),  # Convert to percentage
            noi=round(noi_value, 2),
            gross_yield=round(gross_yield_value * 100, 2),  # Convert to percentage
            pre_tax_cash_flow=round(pre_cf, 2),
            cash_on_cash=round(coc * 100, 2),  # Convert to percentage
            dscr=round(dscr_value, 2),
            effective_gross_income=round(egi, 2)
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"ROI calculation error: {str(e)}")

@router.post("/property", response_model=PropertyInputResponse)
async def create_property(input_data: PropertyInput):
    """
    Create a new property and store in database
    """
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                INSERT INTO property_inputs 
                (purchase_price, gross_rent_annual, vacancy_rate, operating_expenses, 
                 annual_mortgage_payment, equity)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, purchase_price, gross_rent_annual, vacancy_rate,
                         operating_expenses, annual_mortgage_payment, equity, created_at
            """, (
                input_data.purchase_price,
                input_data.gross_rent_annual,
                input_data.vacancy_rate,
                input_data.operating_expenses,
                input_data.annual_mortgage_payment,
                input_data.equity
            ))
            result = cur.fetchone()
            conn.commit()
            conn.close()
            
            return PropertyInputResponse(
                id=result['id'],
                purchase_price=float(result['purchase_price']),
                gross_rent_annual=float(result['gross_rent_annual']),
                vacancy_rate=float(result['vacancy_rate']),
                operating_expenses=float(result['operating_expenses']),
                annual_mortgage_payment=float(result['annual_mortgage_payment']),
                equity=float(result['equity']),
                created_at=str(result['created_at'])
            )
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating property: {str(e)}")

@router.get("/property/{property_id}", response_model=PropertyInputResponse)
async def get_property(property_id: int):
    """
    Get property details by ID
    """
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, purchase_price, gross_rent_annual, vacancy_rate,
                       operating_expenses, annual_mortgage_payment, equity, created_at
                FROM property_inputs WHERE id = %s
            """, (property_id,))
            result = cur.fetchone()
            conn.close()
            
            if not result:
                raise HTTPException(status_code=404, detail="Property not found")
            
            return PropertyInputResponse(
                id=result['id'],
                purchase_price=float(result['purchase_price']),
                gross_rent_annual=float(result['gross_rent_annual']),
                vacancy_rate=float(result['vacancy_rate']),
                operating_expenses=float(result['operating_expenses']),
                annual_mortgage_payment=float(result['annual_mortgage_payment']),
                equity=float(result['equity']),
                created_at=str(result['created_at'])
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error fetching property: {str(e)}")

@router.get("/property/{property_id}/calculate", response_model=ROICalculation)
async def calculate_property_roi(property_id: int):
    """
    Calculate and store ROI for an existing property
    """
    try:
        results = compute_and_store_property_roi(property_id)
        
        # Get property details for additional calculations
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT purchase_price, gross_rent_annual, vacancy_rate
                FROM property_inputs WHERE id = %s
            """, (property_id,))
            property_data = cur.fetchone()
            conn.close()
        
        if not property_data:
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Calculate additional metrics
        egi = effective_gross_income(
            property_data['gross_rent_annual'], 
            property_data['vacancy_rate']
        )
        gross_yield_value = gross_yield(
            property_data['gross_rent_annual'], 
            property_data['purchase_price']
        )
        
        return ROICalculation(
            property_id=property_id,
            cap_rate=round(results['cap_rate'] * 100, 2),  # Convert to percentage
            noi=round(results['noi'], 2),
            gross_yield=round(gross_yield_value * 100, 2),  # Convert to percentage
            pre_tax_cash_flow=round(results['pre_tax_cash_flow'], 2),
            cash_on_cash=round(results['cash_on_cash'] * 100, 2),  # Convert to percentage
            dscr=round(results['dscr'], 2),
            effective_gross_income=round(egi, 2)
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error calculating ROI: {str(e)}")

@router.get("/properties", response_model=List[PropertyInputResponse])
async def list_properties():
    """
    List all properties
    """
    try:
        conn = get_db_connection()
        with conn.cursor(cursor_factory=RealDictCursor) as cur:
            cur.execute("""
                SELECT id, purchase_price, gross_rent_annual, vacancy_rate,
                       operating_expenses, annual_mortgage_payment, equity, created_at
                FROM property_inputs ORDER BY created_at DESC
            """)
            results = cur.fetchall()
            conn.close()
            
            return [
                PropertyInputResponse(
                    id=row['id'],
                    purchase_price=float(row['purchase_price']),
                    gross_rent_annual=float(row['gross_rent_annual']),
                    vacancy_rate=float(row['vacancy_rate']),
                    operating_expenses=float(row['operating_expenses']),
                    annual_mortgage_payment=float(row['annual_mortgage_payment']),
                    equity=float(row['equity']),
                    created_at=str(row['created_at'])
                )
                for row in results
            ]
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error listing properties: {str(e)}")

@router.delete("/property/{property_id}")
async def delete_property(property_id: int):
    """
    Delete a property and its ROI results
    """
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            # Delete ROI results first (foreign key constraint)
            cur.execute("DELETE FROM property_roi_results WHERE property_id = %s", (property_id,))
            # Delete property
            cur.execute("DELETE FROM property_inputs WHERE id = %s", (property_id,))
            
            if cur.rowcount == 0:
                raise HTTPException(status_code=404, detail="Property not found")
            
            conn.commit()
            conn.close()
            
            return {"message": f"Property {property_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error deleting property: {str(e)}")

@router.get("/health")
async def health_check():
    """
    Health check endpoint for ROI service
    """
    try:
        conn = get_db_connection()
        with conn.cursor() as cur:
            cur.execute("SELECT 1")
        conn.close()
        return {"status": "healthy", "service": "ROI Calculator"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")
