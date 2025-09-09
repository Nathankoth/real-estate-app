"""
VistaForge ROI Calculator API
FastAPI server for comprehensive real estate investment analysis
"""

from fastapi import FastAPI, HTTPException, Depends, Query, Path
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, Any, List, Optional
import uvicorn
import os
from dotenv import load_dotenv
from datetime import datetime, date
import logging

from roi_engine import ROIEngine
from db import get_db_manager, DatabaseManager
from backtest import BacktestEngine

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="VistaForge ROI Calculator API",
    description="Advanced real estate investment analysis API with comprehensive ROI calculations, backtesting, and portfolio management",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engines
roi_engine = ROIEngine()
backtest_engine = BacktestEngine()

# Pydantic models
class PropertyInput(BaseModel):
    property_name: Optional[str] = Field(None, description="Name of the property")
    address: Optional[str] = Field(None, description="Property address")
    city: Optional[str] = Field(None, description="City")
    state: Optional[str] = Field(None, description="State")
    zip_code: Optional[str] = Field(None, description="ZIP code")
    property_type: str = Field("residential", description="Type of property")
    purchase_price: float = Field(..., gt=0, description="Purchase price")
    gross_rent_annual: float = Field(..., ge=0, description="Annual gross rent")
    vacancy_rate: float = Field(0.05, ge=0, le=1, description="Vacancy rate (0-1)")
    operating_expenses: float = Field(..., ge=0, description="Annual operating expenses")
    annual_mortgage_payment: float = Field(0, ge=0, description="Annual mortgage payment")
    equity: float = Field(..., ge=0, description="Equity/down payment")
    down_payment: Optional[float] = Field(None, ge=0, description="Down payment amount")
    loan_amount: Optional[float] = Field(None, ge=0, description="Loan amount")
    interest_rate: Optional[float] = Field(None, ge=0, le=1, description="Interest rate (0-1)")
    loan_term_years: int = Field(30, ge=1, le=50, description="Loan term in years")
    property_taxes: Optional[float] = Field(None, ge=0, description="Annual property taxes")
    insurance: Optional[float] = Field(None, ge=0, description="Annual insurance")
    maintenance: Optional[float] = Field(None, ge=0, description="Annual maintenance")
    management_fee: Optional[float] = Field(None, ge=0, description="Annual management fee")
    utilities: Optional[float] = Field(None, ge=0, description="Annual utilities")
    other_expenses: Optional[float] = Field(None, ge=0, description="Other annual expenses")
    annual_appreciation: float = Field(0.03, ge=0, le=1, description="Expected annual appreciation")
    hold_years: int = Field(5, ge=1, le=50, description="Expected hold period in years")
    discount_rate: float = Field(0.08, ge=0, le=1, description="Discount rate for NPV calculation")

class ROICalculationRequest(BaseModel):
    purchase_price: float = Field(..., gt=0, description="Purchase price")
    monthly_rent: float = Field(..., ge=0, description="Monthly rent")
    monthly_expenses: float = Field(..., ge=0, description="Monthly expenses")
    occupancy_rate: float = Field(0.9, ge=0, le=1, description="Occupancy rate")
    hold_years: int = Field(5, ge=1, le=50, description="Hold period in years")
    annual_appreciation: float = Field(0.03, ge=0, le=1, description="Annual appreciation rate")
    down_payment: Optional[float] = Field(None, ge=0, description="Down payment amount")
    interest_rate: Optional[float] = Field(None, ge=0, le=1, description="Interest rate")
    loan_term_years: int = Field(30, ge=1, le=50, description="Loan term in years")

class MonthlyPerformanceInput(BaseModel):
    property_id: int = Field(..., gt=0, description="Property ID")
    month_year: str = Field(..., description="Month and year (YYYY-MM)")
    income: float = Field(..., ge=0, description="Monthly income")
    expenses: float = Field(..., ge=0, description="Monthly expenses")
    notes: Optional[str] = Field(None, description="Optional notes")

class MarketDataInput(BaseModel):
    location: str = Field(..., description="Location identifier")
    data_type: str = Field(..., description="Type of market data")
    value: float = Field(..., description="Data value")
    date_recorded: str = Field(..., description="Date recorded (YYYY-MM-DD)")
    source: Optional[str] = Field(None, description="Data source")

class BacktestRequest(BaseModel):
    property_id: int = Field(..., gt=0, description="Property ID")
    backtest_name: str = Field(..., description="Name of the backtest")
    start_date: str = Field(..., description="Start date (YYYY-MM-DD)")
    end_date: str = Field(..., description="End date (YYYY-MM-DD)")
    initial_capital: float = Field(..., gt=0, description="Initial capital")
    strategy: str = Field("buy_and_hold", description="Investment strategy")

class PropertyResponse(BaseModel):
    id: int
    property_name: Optional[str]
    address: Optional[str]
    city: Optional[str]
    state: Optional[str]
    zip_code: Optional[str]
    property_type: str
    purchase_price: float
    gross_rent_annual: float
    vacancy_rate: float
    operating_expenses: float
    annual_mortgage_payment: float
    equity: float
    created_at: datetime

class ROICalculationResponse(BaseModel):
    property_id: int
    metrics: Dict[str, float]
    interpretation: List[str]
    calculated_at: str

class BacktestResponse(BaseModel):
    backtest_id: int
    property_id: int
    backtest_name: str
    start_date: str
    end_date: str
    initial_value: float
    final_value: float
    total_return: float
    annualized_return: float
    results: Dict[str, Any]

# Dependency to get database manager
def get_db() -> DatabaseManager:
    return get_db_manager()

# Health check endpoint
@app.get("/health")
async def health_check():
    """
    Health check endpoint
    """
    try:
        db = get_db()
        # Test database connection
        db.execute_query("SELECT 1", fetch='one')
        
        return {
            "status": "healthy",
            "service": "VistaForge ROI Calculator API",
            "version": "1.0.0",
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=503, detail=f"Service unhealthy: {str(e)}")

# ROI Calculation endpoints
@app.post("/roi/calculate", response_model=ROICalculationResponse)
async def calculate_roi(request: ROICalculationRequest):
    """
    Calculate ROI metrics without storing in database
    """
    try:
        # Convert monthly to annual values
        annual_rent = request.monthly_rent * 12 * request.occupancy_rate
        annual_expenses = request.monthly_expenses * 12
        
        # Calculate derived values
        down_payment = request.down_payment or (request.purchase_price * 0.2)  # Default 20%
        loan_amount = request.purchase_price - down_payment
        equity = down_payment
        
        # Calculate mortgage payment if interest rate provided
        annual_mortgage_payment = 0
        if request.interest_rate and loan_amount > 0:
            annual_mortgage_payment = roi_engine.calculate_annual_mortgage_payment(
                loan_amount, request.interest_rate, request.loan_term_years
            )
        
        # Prepare input data
        property_data = {
            'purchase_price': request.purchase_price,
            'gross_rent_annual': annual_rent,
            'vacancy_rate': 1 - request.occupancy_rate,
            'operating_expenses': annual_expenses,
            'annual_mortgage_payment': annual_mortgage_payment,
            'equity': equity,
            'down_payment': down_payment,
            'loan_amount': loan_amount,
            'interest_rate': request.interest_rate,
            'loan_term_years': request.loan_term_years,
            'annual_appreciation': request.annual_appreciation,
            'hold_years': request.hold_years
        }
        
        # Calculate ROI
        results = roi_engine.calculate_comprehensive_roi(property_data)
        
        return ROICalculationResponse(
            property_id=0,  # Not stored in DB
            metrics=results['metrics'],
            interpretation=results['interpretation'],
            calculated_at=results['calculated_at']
        )
    except Exception as e:
        logger.error(f"ROI calculation error: {e}")
        raise HTTPException(status_code=400, detail=f"ROI calculation failed: {str(e)}")

@app.post("/roi/property", response_model=PropertyResponse)
async def create_property(property_data: PropertyInput, db: DatabaseManager = Depends(get_db)):
    """
    Create a new property and store in database
    """
    try:
        # Convert to dictionary and handle None values
        prop_dict = property_data.dict()
        prop_dict = {k: v for k, v in prop_dict.items() if v is not None}
        
        # Insert property
        property_id = db.insert_property(prop_dict)
        
        # Get the created property
        created_property = db.get_property(property_id)
        
        return PropertyResponse(**created_property)
    except Exception as e:
        logger.error(f"Error creating property: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to create property: {str(e)}")

@app.get("/roi/property/{property_id}", response_model=PropertyResponse)
async def get_property(property_id: int = Path(..., gt=0), db: DatabaseManager = Depends(get_db)):
    """
    Get property details by ID
    """
    try:
        property_data = db.get_property(property_id)
        if not property_data:
            raise HTTPException(status_code=404, detail="Property not found")
        
        return PropertyResponse(**property_data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching property: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch property: {str(e)}")

@app.get("/roi/properties", response_model=List[PropertyResponse])
async def list_properties(db: DatabaseManager = Depends(get_db)):
    """
    List all properties
    """
    try:
        properties = db.get_all_properties()
        return [PropertyResponse(**prop) for prop in properties]
    except Exception as e:
        logger.error(f"Error listing properties: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to list properties: {str(e)}")

@app.put("/roi/property/{property_id}", response_model=PropertyResponse)
async def update_property(
    property_id: int = Path(..., gt=0),
    property_data: PropertyInput = None,
    db: DatabaseManager = Depends(get_db)
):
    """
    Update property information
    """
    try:
        # Check if property exists
        existing_property = db.get_property(property_id)
        if not existing_property:
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Convert to dictionary and handle None values
        prop_dict = property_data.dict()
        prop_dict = {k: v for k, v in prop_dict.items() if v is not None}
        
        # Update property
        success = db.update_property(property_id, prop_dict)
        if not success:
            raise HTTPException(status_code=400, detail="Failed to update property")
        
        # Get updated property
        updated_property = db.get_property(property_id)
        return PropertyResponse(**updated_property)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating property: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to update property: {str(e)}")

@app.delete("/roi/property/{property_id}")
async def delete_property(property_id: int = Path(..., gt=0), db: DatabaseManager = Depends(get_db)):
    """
    Delete a property and its related data
    """
    try:
        success = db.delete_property(property_id)
        if not success:
            raise HTTPException(status_code=404, detail="Property not found")
        
        return {"message": f"Property {property_id} deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting property: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to delete property: {str(e)}")

@app.post("/roi/property/{property_id}/calculate", response_model=ROICalculationResponse)
async def calculate_property_roi(
    property_id: int = Path(..., gt=0),
    db: DatabaseManager = Depends(get_db)
):
    """
    Calculate and store ROI for an existing property
    """
    try:
        # Get property data
        property_data = db.get_property(property_id)
        if not property_data:
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Calculate ROI
        results = roi_engine.calculate_comprehensive_roi(property_data)
        
        # Store ROI results
        db.insert_roi_result(property_id, results['metrics'])
        
        return ROICalculationResponse(
            property_id=property_id,
            metrics=results['metrics'],
            interpretation=results['interpretation'],
            calculated_at=results['calculated_at']
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error calculating property ROI: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to calculate ROI: {str(e)}")

# Monthly Performance endpoints
@app.post("/performance/monthly")
async def add_monthly_performance(
    performance_data: MonthlyPerformanceInput,
    db: DatabaseManager = Depends(get_db)
):
    """
    Add monthly performance data for a property
    """
    try:
        # Validate property exists
        property_data = db.get_property(performance_data.property_id)
        if not property_data:
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Insert performance data
        performance_id = db.insert_monthly_performance(
            performance_data.property_id,
            performance_data.month_year,
            performance_data.income,
            performance_data.expenses,
            performance_data.notes
        )
        
        return {"message": "Monthly performance added successfully", "id": performance_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error adding monthly performance: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to add performance data: {str(e)}")

@app.get("/performance/monthly/{property_id}")
async def get_monthly_performance(
    property_id: int = Path(..., gt=0),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM)"),
    db: DatabaseManager = Depends(get_db)
):
    """
    Get monthly performance data for a property
    """
    try:
        performance_data = db.get_monthly_performance(property_id, start_date, end_date)
        return {"property_id": property_id, "performance_data": performance_data}
    except Exception as e:
        logger.error(f"Error fetching monthly performance: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch performance data: {str(e)}")

# Market Data endpoints
@app.post("/market-data")
async def add_market_data(
    market_data: MarketDataInput,
    db: DatabaseManager = Depends(get_db)
):
    """
    Add market data
    """
    try:
        market_id = db.insert_market_data(
            market_data.location,
            market_data.data_type,
            market_data.value,
            market_data.date_recorded,
            market_data.source
        )
        
        return {"message": "Market data added successfully", "id": market_id}
    except Exception as e:
        logger.error(f"Error adding market data: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to add market data: {str(e)}")

@app.get("/market-data/{location}")
async def get_market_data(
    location: str = Path(..., description="Location identifier"),
    data_type: Optional[str] = Query(None, description="Type of market data"),
    start_date: Optional[str] = Query(None, description="Start date (YYYY-MM-DD)"),
    end_date: Optional[str] = Query(None, description="End date (YYYY-MM-DD)"),
    db: DatabaseManager = Depends(get_db)
):
    """
    Get market data for a location
    """
    try:
        market_data = db.get_market_data(location, data_type, start_date, end_date)
        return {"location": location, "market_data": market_data}
    except Exception as e:
        logger.error(f"Error fetching market data: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch market data: {str(e)}")

# Backtesting endpoints
@app.post("/backtest", response_model=BacktestResponse)
async def run_backtest(
    backtest_request: BacktestRequest,
    db: DatabaseManager = Depends(get_db)
):
    """
    Run backtesting analysis for a property
    """
    try:
        # Get property data
        property_data = db.get_property(backtest_request.property_id)
        if not property_data:
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Run backtest
        backtest_results = backtest_engine.run_backtest(
            property_data,
            backtest_request.start_date,
            backtest_request.end_date,
            backtest_request.initial_capital,
            backtest_request.strategy
        )
        
        # Store backtest results
        backtest_id = db.insert_backtest_result(
            backtest_request.property_id,
            backtest_request.backtest_name,
            backtest_request.start_date,
            backtest_request.end_date,
            backtest_request.initial_capital,
            backtest_results['final_value'],
            backtest_results
        )
        
        return BacktestResponse(
            backtest_id=backtest_id,
            property_id=backtest_request.property_id,
            backtest_name=backtest_request.backtest_name,
            start_date=backtest_request.start_date,
            end_date=backtest_request.end_date,
            initial_value=backtest_request.initial_capital,
            final_value=backtest_results['final_value'],
            total_return=backtest_results['total_return'],
            annualized_return=backtest_results['annualized_return'],
            results=backtest_results
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error running backtest: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to run backtest: {str(e)}")

@app.get("/backtest/{property_id}")
async def get_backtest_results(
    property_id: int = Path(..., gt=0),
    db: DatabaseManager = Depends(get_db)
):
    """
    Get backtest results for a property
    """
    try:
        backtest_results = db.get_backtest_results(property_id)
        return {"property_id": property_id, "backtest_results": backtest_results}
    except Exception as e:
        logger.error(f"Error fetching backtest results: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch backtest results: {str(e)}")

# Portfolio endpoints
@app.get("/portfolio/summary")
async def get_portfolio_summary(db: DatabaseManager = Depends(get_db)):
    """
    Get portfolio summary statistics
    """
    try:
        summary = db.get_portfolio_summary()
        return summary
    except Exception as e:
        logger.error(f"Error fetching portfolio summary: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch portfolio summary: {str(e)}")

@app.post("/portfolio/compare")
async def compare_properties(property_ids: List[int], db: DatabaseManager = Depends(get_db)):
    """
    Compare multiple properties
    """
    try:
        properties = []
        for prop_id in property_ids:
            prop_data = db.get_property(prop_id)
            if prop_data:
                properties.append(prop_data)
        
        if not properties:
            raise HTTPException(status_code=404, detail="No valid properties found")
        
        comparison_results = roi_engine.compare_properties(properties)
        return comparison_results
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error comparing properties: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to compare properties: {str(e)}")

@app.post("/portfolio/sensitivity")
async def sensitivity_analysis(
    property_id: int = Query(..., gt=0),
    variable_ranges: Dict[str, List[float]] = None,
    db: DatabaseManager = Depends(get_db)
):
    """
    Perform sensitivity analysis on a property
    """
    try:
        # Get property data
        property_data = db.get_property(property_id)
        if not property_data:
            raise HTTPException(status_code=404, detail="Property not found")
        
        # Default variable ranges if not provided
        if not variable_ranges:
            variable_ranges = {
                'vacancy_rate': [0.02, 0.05, 0.08, 0.10, 0.15],
                'operating_expenses': [property_data['operating_expenses'] * 0.8, 
                                     property_data['operating_expenses'] * 0.9,
                                     property_data['operating_expenses'],
                                     property_data['operating_expenses'] * 1.1,
                                     property_data['operating_expenses'] * 1.2],
                'annual_appreciation': [0.01, 0.02, 0.03, 0.04, 0.05]
            }
        
        sensitivity_results = roi_engine.sensitivity_analysis(property_data, variable_ranges)
        return sensitivity_results
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error running sensitivity analysis: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to run sensitivity analysis: {str(e)}")

# Startup event
@app.on_event("startup")
async def startup_event():
    """
    Initialize database on startup
    """
    try:
        from db import init_database
        init_database()
        logger.info("API startup completed successfully")
    except Exception as e:
        logger.error(f"Startup failed: {e}")
        raise

if __name__ == "__main__":
    # Run the API server
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True,
        log_level="info"
    )