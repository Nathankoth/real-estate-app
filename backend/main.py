from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
import hashlib
from dotenv import load_dotenv
import openai

# Simple in-memory cache for AI responses
ai_response_cache = {}

# Load environment variables
load_dotenv()

# FastAPI app
app = FastAPI(title="Real Estate ROI Calculator API", version="2.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class ROIAnalysisRequest(BaseModel):
    purchase_price: float
    monthly_rent: float
    monthly_expenses: float
    occupancy_rate: float = 0.9
    hold_years: int = 5
    annual_appreciation: float = 0.03
    region: str = "USA"
    currency: str = "$"
    mode: str = "simple"  # "simple" or "advanced"

class ROIAnalysisResponse(BaseModel):
    capRate: float
    NOI: float
    cashOnCash: Optional[float] = None
    dscr: Optional[float] = None
    terminalValue: Optional[float] = None
    analysis: str

# ROI Calculation Functions
def calculate_roi_metrics(
    purchase_price: float,
    monthly_rent: float,
    monthly_expenses: float,
    occupancy_rate: float = 0.9,
    hold_years: int = 5,
    annual_appreciation: float = 0.03,
    mode: str = "simple"
) -> Dict[str, Any]:
    """Calculate ROI metrics based on input parameters"""
    
    # Convert monthly to annual values
    annual_rent = monthly_rent * 12 * occupancy_rate
    annual_expenses = monthly_expenses * 12
    
    # Calculate basic metrics
    egi = annual_rent  # Effective Gross Income (after occupancy)
    noi = egi - annual_expenses  # Net Operating Income
    cap_rate = noi / purchase_price if purchase_price > 0 else 0
    
    # Calculate gross yield
    gross_yield = annual_rent / purchase_price if purchase_price > 0 else 0
    
    results = {
        "capRate": cap_rate,
        "NOI": noi,
        "grossYield": gross_yield,
        "EGI": egi
    }
    
    # Advanced metrics for advanced mode
    if mode == "advanced":
        # Assume 20% down payment for cash-on-cash calculation
        down_payment = purchase_price * 0.2
        annual_mortgage_payment = purchase_price * 0.8 * 0.06  # 6% interest rate assumption
        
        # Cash-on-Cash Return
        annual_cash_flow = noi - annual_mortgage_payment
        cash_on_cash = annual_cash_flow / down_payment if down_payment > 0 else 0
        
        # DSCR (Debt Service Coverage Ratio)
        dscr = noi / annual_mortgage_payment if annual_mortgage_payment > 0 else 0
        
        # Terminal Value
        terminal_value = purchase_price * ((1 + annual_appreciation) ** hold_years)
        
        results.update({
            "cashOnCash": cash_on_cash,
            "dscr": dscr,
            "terminalValue": terminal_value,
            "annualCashFlow": annual_cash_flow
        })
    
    return results

# AI Analysis Generation
async def generate_ai_analysis(results: Dict[str, Any], region: str, currency: str, mode: str) -> str:
    """Generate fast AI-powered real estate investment analysis with caching"""
    try:
        # Check if OpenAI API key is available
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            return "AI analysis unavailable - OpenAI API key not configured"
        
        # Create cache key from input parameters
        cache_key = hashlib.md5(f"{results.get('capRate', 0):.3f}_{results.get('NOI', 0)}_{region}_{currency}_{mode}".encode()).hexdigest()
        
        # Check cache first
        if cache_key in ai_response_cache:
            print(f"Cache hit for key: {cache_key[:8]}...")
            return ai_response_cache[cache_key]
        
        # Prepare metrics for analysis
        cap_rate = results.get("capRate", 0)
        noi = results.get("NOI", 0)
        gross_yield = results.get("grossYield", 0)
        
        # Market benchmarks by region
        market_benchmarks = {
            "USA": {"cap_rate_range": "4-8%", "context": "Federal Reserve rates, housing supply"},
            "Nigeria": {"cap_rate_range": "8-15%", "context": "inflation ~16%, currency stability"},
            "UK": {"cap_rate_range": "4-6%", "context": "Bank of England rates, Brexit impacts"},
            "Canada": {"cap_rate_range": "3-7%", "context": "immigration trends, housing supply"},
            "Australia": {"cap_rate_range": "4-8%", "context": "RBA rates, population growth"}
        }
        
        benchmark = market_benchmarks.get(region, {"cap_rate_range": "4-8%", "context": "local market conditions"})
        
        # Create concise, optimized prompt
        prompt = f"""Analyze this {region} property investment. Use {currency} throughout.

Metrics: Cap Rate {cap_rate:.1%}, NOI {currency}{noi:,.0f}, Gross Yield {gross_yield:.1%}"""

        if mode == "advanced":
            cash_on_cash = results.get("cashOnCash", 0)
            dscr = results.get("dscr", 0)
            terminal_value = results.get("terminalValue", 0)
            prompt += f", Cash-on-Cash {cash_on_cash:.1%}, DSCR {dscr:.1f}, Terminal Value {currency}{terminal_value:,.0f}"

        prompt += f"""

Market Context: {benchmark['context']}. Typical {region} cap rates: {benchmark['cap_rate_range']}.

Provide concise analysis in these sections:
Local Market Context
Cap Rate Analysis  
NOI Assessment
Investment Recommendation

Write naturally, no formatting symbols. Focus on {region} market first, then global context. Keep under 300 words."""

        # Call OpenAI API with optimized parameters
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a real estate investment analyst. Provide concise, actionable analysis."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,  # Reduced from 800
            temperature=0.7,  # Slightly increased for faster response
            top_p=0.9,  # Added for faster generation
            frequency_penalty=0.1,  # Added for better quality
            presence_penalty=0.1  # Added for better quality
        )
        
        result = response.choices[0].message.content.strip()
        
        # Cache the result (limit cache size to prevent memory issues)
        if len(ai_response_cache) < 100:  # Keep only last 100 responses
            ai_response_cache[cache_key] = result
            print(f"Cached response for key: {cache_key[:8]}...")
        
        return result
        
    except Exception as e:
        print(f"AI analysis error: {e}")
        return "AI analysis is temporarily unavailable. Please try again later."

# API Endpoints
@app.get("/")
async def root():
    return {"message": "Real Estate ROI Calculator API", "version": "2.0.0"}

@app.post("/api/roi-analysis", response_model=ROIAnalysisResponse)
async def roi_analysis_endpoint(request: ROIAnalysisRequest):
    """
    Calculate ROI analysis with AI-powered insights
    """
    try:
        # Validate inputs
        if request.purchase_price <= 0:
            raise HTTPException(status_code=400, detail="Purchase price must be greater than 0")
        
        if request.monthly_rent < 0:
            raise HTTPException(status_code=400, detail="Monthly rent cannot be negative")
        
        if request.monthly_expenses < 0:
            raise HTTPException(status_code=400, detail="Monthly expenses cannot be negative")
        
        # Calculate ROI metrics
        results = calculate_roi_metrics(
            purchase_price=request.purchase_price,
            monthly_rent=request.monthly_rent,
            monthly_expenses=request.monthly_expenses,
            occupancy_rate=request.occupancy_rate,
            hold_years=request.hold_years,
            annual_appreciation=request.annual_appreciation,
            mode=request.mode
        )
        
        # Generate AI analysis
        ai_analysis = await generate_ai_analysis(
            results=results,
            region=request.region,
            currency=request.currency,
            mode=request.mode
        )
        
        # Prepare response
        response_data = {
            "capRate": results["capRate"],
            "NOI": results["NOI"],
            "analysis": ai_analysis
        }
        
        # Add advanced metrics for advanced mode
        if request.mode == "advanced":
            response_data.update({
                "cashOnCash": results.get("cashOnCash"),
                "dscr": results.get("dscr"),
                "terminalValue": results.get("terminalValue")
            })
        
        return ROIAnalysisResponse(**response_data)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating ROI analysis: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "2.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)