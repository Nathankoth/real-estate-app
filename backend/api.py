# api.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from roi_engine import compute_roi_from_inputs
import db

app = FastAPI(title="ROI Calculator API")

class ROIInput(BaseModel):
    purchase_price: float
    gross_rent_annual: float
    vacancy_rate: float = 0.1
    operating_expenses: float = 0
    annual_mortgage_payment: float = 0
    equity: Optional[float] = None
    hold_years: int = 5
    renovation_cost: float = 0.0

class ComputeAndStore(BaseModel):
    property_id: int
    inputs: ROIInput

@app.post("/compute")
def compute(inputs: ROIInput):
    try:
        data = compute_roi_from_inputs(inputs.dict())
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/compute_and_store")
def compute_and_store(payload: ComputeAndStore):
    try:
        result = compute_roi_from_inputs(payload.inputs.dict())
        # store in DB
        db.save_roi_results(payload.property_id, result)
        return {"status":"ok", "result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
