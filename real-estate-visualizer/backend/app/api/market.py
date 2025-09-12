from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import statistics

router = APIRouter(prefix="/api/market", tags=["market"])

class MarketAnalysisRequest(BaseModel):
    location: str
    property_type: str
    price_range: Dict[str, float]
    analysis_type: str = "comprehensive"

class MarketTrend(BaseModel):
    period: str
    average_price: float
    price_change: float
    volume: int
    days_on_market: float

class MarketAnalysisResponse(BaseModel):
    location: str
    property_type: str
    current_market_data: Dict[str, Any]
    trends: List[MarketTrend]
    predictions: Dict[str, Any]
    recommendations: List[str]
    market_score: float

@router.post("/analyze", response_model=MarketAnalysisResponse)
async def analyze_market(request: MarketAnalysisRequest):
    """
    Perform comprehensive market analysis for a specific location and property type
    """
    try:
        # TODO: Integrate with real market data APIs (Zillow, Realtor.com, etc.)
        # For now, generate realistic sample data
        
        # Current market data
        current_data = {
            "average_price": 450000,
            "median_price": 425000,
            "price_per_sqft": 280,
            "inventory_count": 150,
            "days_on_market": 35,
            "price_reduction_rate": 0.15,
            "market_activity": "Active"
        }
        
        # Generate trend data for the last 12 months
        trends = []
        base_price = 420000
        for i in range(12):
            month = datetime.now() - timedelta(days=30*i)
            price_change = (i - 6) * 0.02  # Simulate market fluctuations
            current_price = base_price * (1 + price_change)
            
            trends.append(MarketTrend(
                period=month.strftime("%Y-%m"),
                average_price=round(current_price, 2),
                price_change=round(price_change * 100, 2),
                volume=max(10, 25 - abs(i - 6) * 2),  # Simulate seasonal volume
                days_on_market=max(20, 40 - i * 1.5)
            ))
        
        # Market predictions
        predictions = {
            "next_6_months": {
                "price_direction": "Stable to Slight Increase",
                "confidence": 0.75,
                "expected_change": 2.5
            },
            "next_12_months": {
                "price_direction": "Moderate Increase",
                "confidence": 0.68,
                "expected_change": 5.2
            },
            "risk_factors": [
                "Interest rate volatility",
                "Local economic conditions",
                "Inventory levels"
            ]
        }
        
        # Generate recommendations based on market conditions
        recommendations = []
        
        if current_data["days_on_market"] > 45:
            recommendations.append("Market shows slower activity - consider competitive pricing")
        elif current_data["days_on_market"] < 20:
            recommendations.append("Hot market - properties selling quickly, consider faster decision making")
        
        if current_data["price_reduction_rate"] > 0.2:
            recommendations.append("High price reduction rate suggests initial pricing may be too high")
        
        if current_data["inventory_count"] < 100:
            recommendations.append("Low inventory - good time for sellers, challenging for buyers")
        elif current_data["inventory_count"] > 200:
            recommendations.append("High inventory - buyer's market, more negotiating power")
        
        # Calculate market score (0-100)
        market_score = calculate_market_score(current_data, trends)
        
        return MarketAnalysisResponse(
            location=request.location,
            property_type=request.property_type,
            current_market_data=current_data,
            trends=trends,
            predictions=predictions,
            recommendations=recommendations,
            market_score=market_score
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market analysis error: {str(e)}")

@router.get("/trends/{location}")
async def get_market_trends(location: str, months: int = 12):
    """
    Get historical market trends for a location
    """
    try:
        # TODO: Fetch real historical data
        trends = []
        base_price = 400000
        
        for i in range(months):
            date = datetime.now() - timedelta(days=30*i)
            price = base_price * (1 + (i * 0.01))  # Simulate gradual increase
            volume = max(5, 20 - abs(i - 6) * 1.5)  # Simulate seasonal patterns
            
            trends.append({
                "date": date.strftime("%Y-%m-%d"),
                "average_price": round(price, 2),
                "median_price": round(price * 0.95, 2),
                "volume": int(volume),
                "days_on_market": max(15, 45 - i * 2)
            })
        
        return {
            "location": location,
            "period_months": months,
            "trends": trends
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/comparables/{location}")
async def get_comparable_properties(location: str, property_type: str = "residential"):
    """
    Get comparable properties for market analysis
    """
    try:
        # TODO: Fetch real comparable properties
        comparables = []
        
        for i in range(5):
            comparables.append({
                "address": f"{100 + i*50} Main St, {location}",
                "price": 400000 + i * 25000,
                "sqft": 1500 + i * 200,
                "bedrooms": 3 + (i % 2),
                "bathrooms": 2 + (i % 2),
                "year_built": 2010 + i * 2,
                "days_on_market": 20 + i * 5,
                "price_per_sqft": round((400000 + i * 25000) / (1500 + i * 200), 2)
            })
        
        return {
            "location": location,
            "property_type": property_type,
            "comparables": comparables,
            "analysis_date": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def calculate_market_score(current_data: Dict, trends: List[MarketTrend]) -> float:
    """Calculate overall market health score (0-100)"""
    score = 50  # Base score
    
    # Adjust based on days on market
    if current_data["days_on_market"] < 30:
        score += 15
    elif current_data["days_on_market"] > 60:
        score -= 20
    
    # Adjust based on price trends
    recent_trends = trends[:3]  # Last 3 months
    avg_price_change = statistics.mean([t.price_change for t in recent_trends])
    if avg_price_change > 0:
        score += 10
    elif avg_price_change < -2:
        score -= 15
    
    # Adjust based on inventory
    if current_data["inventory_count"] < 100:
        score += 10  # Low inventory is good for sellers
    elif current_data["inventory_count"] > 200:
        score -= 10  # High inventory favors buyers
    
    return max(0, min(100, score))
