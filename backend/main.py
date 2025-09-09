from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
import os
from dotenv import load_dotenv
import openai

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
    """Generate AI-powered real estate investment analysis with real-world market context"""
    try:
        # Check if OpenAI API key is available
        openai_api_key = os.getenv("OPENAI_API_KEY")
        if not openai_api_key:
            return "AI analysis unavailable - OpenAI API key not configured"
        
        # Prepare metrics for analysis
        cap_rate = results.get("capRate", 0)
        noi = results.get("NOI", 0)
        gross_yield = results.get("grossYield", 0)
        
        # Get current date for market context
        from datetime import datetime
        current_date = datetime.now().strftime("%B %Y")
        
        # Create sophisticated prompt with local-first market context
        prompt = f"""
        You are a senior real estate investment analyst with 15+ years of experience in global markets. 
        Provide a comprehensive investment analysis for a property in {region} as of {current_date}.
        Use {currency} as the currency symbol throughout.
        
        CRITICAL INSTRUCTIONS:
        - Write in natural, human language as if speaking to a client
        - Do NOT use markdown, asterisks, hashtags, bullet points, or any formatting symbols
        - PRIORITIZE local market analysis first, then show global context
        - Focus heavily on {region}-specific market conditions and trends
        - Compare to actual local market benchmarks for {region}
        - Then relate local performance to global market standards
        - Provide specific, actionable insights
        - Use professional but accessible language
        
        Structure your analysis with these exact section headers:
        Local Market Context
        Cap Rate Analysis
        Net Operating Income Assessment
        Cash Flow Performance
        Risk Assessment
        Global Market Perspective
        Investment Recommendation
        
        Property Metrics to Analyze:
        - Cap Rate: {cap_rate:.2%}
        - Net Operating Income: {currency}{noi:,.0f}
        - Gross Yield: {gross_yield:.2%}
        """
        
        # Add advanced metrics if available
        if mode == "advanced":
            cash_on_cash = results.get("cashOnCash", 0)
            dscr = results.get("dscr", 0)
            terminal_value = results.get("terminalValue", 0)
            annual_cash_flow = results.get("annualCashFlow", 0)
            
            prompt += f"""
        - Cash-on-Cash Return: {cash_on_cash:.2%}
        - DSCR: {dscr:.2f}
        - Terminal Value: {currency}{terminal_value:,.0f}
        - Annual Cash Flow: {currency}{annual_cash_flow:,.0f}
        
        For advanced analysis, include:
        - Debt service coverage implications
        - Cash flow sustainability analysis
        - Exit strategy considerations
        - Market timing factors
        """
        else:
            prompt += """
        
        For basic analysis, focus on:
        - Market positioning and competitiveness
        - Income generation potential
        - Basic risk factors
        - Simple investment viability
        """
        
        # Add region-specific market intelligence with local-first emphasis
        market_context = {
            "USA": "LOCAL FOCUS: Analyze current Federal Reserve interest rates, local housing supply constraints, and regional economic growth patterns. Compare to local market averages: typical cap rates 4-8% vary by state. GLOBAL CONTEXT: Compare to international markets like UK (4-6%), Canada (3-7%), and Australia (4-8%).",
            "Nigeria": "LOCAL FOCUS: Factor in local inflation rates (~16%), currency stability, and infrastructure development. Lagos and Abuja markets show different dynamics. Consider local political stability and economic diversification efforts. GLOBAL CONTEXT: Compare to emerging markets like South Africa (6-10%) and developed markets like USA (4-8%).",
            "UK": "LOCAL FOCUS: Account for Bank of England rates, Brexit impacts, and regional variations. London vs. regional markets show significant differences. Consider local stamp duty and tax implications. GLOBAL CONTEXT: Compare to European markets like Germany (3-5%) and France (4-6%), plus US markets (4-8%).",
            "Canada": "LOCAL FOCUS: Consider Bank of Canada rates, local immigration trends, and housing supply issues. Toronto and Vancouver have unique market dynamics. Factor in local foreign buyer restrictions. GLOBAL CONTEXT: Compare to US markets (4-8%) and other Commonwealth markets like Australia (4-8%).",
            "Australia": "LOCAL FOCUS: Account for RBA rates, local population growth, and infrastructure spending. Sydney and Melbourne markets differ significantly. Consider local foreign investment regulations. GLOBAL CONTEXT: Compare to US markets (4-8%), UK markets (4-6%), and Asian markets like Singapore (2-4%)."
        }
        
        region_context = market_context.get(region, f"LOCAL FOCUS: Consider local economic conditions, interest rates, and real estate market trends specific to {region}. GLOBAL CONTEXT: Compare to international market standards and trends.")
        
        prompt += f"""
        
        LOCAL MARKET INTELLIGENCE for {region}:
        {region_context}
        
        ANALYSIS PRIORITY - Focus on these LOCAL aspects first:
        1. How this property compares to current LOCAL market conditions in {region}
        2. What similar LOCAL properties are achieving in terms of cap rates and yields
        3. LOCAL economic factors that could impact this investment
        4. LOCAL growth prospects and infrastructure developments
        5. LOCAL interest rate environment and financing considerations
        6. LOCAL exit strategy timing and market cycles
        
        Then provide GLOBAL PERSPECTIVE:
        7. How {region} market performance compares to global standards
        8. International market trends affecting {region}
        9. Global economic factors influencing local markets
        10. Cross-border investment considerations
        
        Write as if you're presenting to a sophisticated investor who needs LOCAL market intelligence first, then global context for perspective.
        """
        
        prompt += f"""
        
        For each metric, provide 2-3 sentences explaining:
        1. What the metric means in simple terms
        2. How it compares to LOCAL {region} market standards (PRIORITY)
        3. How it compares to global market benchmarks (SECONDARY)
        4. What it suggests about this LOCAL investment opportunity
        
        ANALYSIS STRUCTURE:
        - Start each section with LOCAL market context
        - Then provide global perspective for context
        - Focus on LOCAL actionable insights first
        - Use LOCAL market examples and benchmarks
        
        Keep the tone professional but accessible to non-experts.
        Prioritize LOCAL market intelligence over global comparisons.
        """
        
        # Call OpenAI API
        client = openai.OpenAI(api_key=openai_api_key)
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a professional real estate investment advisor with expertise in ROI analysis across different markets."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=800,
            temperature=0.6
        )
        
        return response.choices[0].message.content.strip()
        
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