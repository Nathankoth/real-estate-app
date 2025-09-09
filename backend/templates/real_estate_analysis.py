"""
Professional Real Estate Investment Analysis Template
Generates contextual analysis based on currency and market conditions
"""

def generate_real_estate_analysis(metrics, currency_symbol="₦", region="Nigeria"):
    """
    Generate professional real estate investment analysis with market context.
    
    Args:
        metrics: Dictionary containing ROI metrics
        currency_symbol: Currency symbol (₦, $, £, €)
        region: Market region (Nigeria, USA, UK, etc.)
    
    Returns:
        str: Professional investment analysis
    """
    
    # Extract metrics
    cap_rate = metrics.get('cap_rate', 0)
    cash_on_cash = metrics.get('cash_on_cash', 0)
    noi = metrics.get('noi', 0)
    dscr = metrics.get('dscr', 0)
    terminal_value = metrics.get('terminal_value', 0)
    
    # Get market context
    market_context = get_market_context(currency_symbol, region)
    
    # Generate analysis
    analysis = f"""
OVERVIEW

This property presents a {get_investment_quality(cap_rate, cash_on_cash, dscr)} investment opportunity in the {region} real estate market. The analysis below examines key performance metrics and their implications for your investment strategy.

CAP RATE

The capitalization rate of {cap_rate:.2%} indicates {get_cap_rate_assessment(cap_rate, market_context)}. {market_context['cap_rate_context']} This rate reflects the property's income-generating potential relative to its purchase price and provides insight into market conditions and investor expectations.

CASH-ON-CASH RETURN

Your cash-on-cash return of {cash_on_cash:.2%} represents {get_coc_assessment(cash_on_cash, market_context)}. {market_context['coc_context']} This metric is particularly important for investors using leverage, as it shows the actual return on the cash you've invested in the property.

NOI

The Net Operating Income of {format_currency(noi, currency_symbol)} demonstrates {get_noi_assessment(noi, market_context)}. {market_context['noi_context']} This figure represents the property's true income potential after accounting for all operating expenses but before debt service and taxes.

DSCR

The Debt Service Coverage Ratio of {dscr:.2f} indicates {get_dscr_assessment(dscr)}. {market_context['dscr_context']} This ratio is crucial for lenders and investors as it shows the property's ability to cover mortgage payments from its operating income.

TERMINAL VALUE

The projected terminal value of {format_currency(terminal_value, currency_symbol)} reflects {get_terminal_value_assessment(terminal_value, market_context)}. {market_context['terminal_value_context']} This future value projection is based on expected appreciation rates and market growth patterns in the {region} real estate sector.

{get_overall_recommendation(cap_rate, cash_on_cash, dscr, market_context)}
"""
    
    return analysis.strip()

def get_market_context(currency_symbol, region):
    """Get market-specific context based on currency and region."""
    
    if currency_symbol == "₦" or region == "Nigeria":
        return {
            "cap_rate_context": "In Nigeria's real estate market, cap rates typically range from 4-8%, with higher rates in emerging areas and lower rates in prime locations like Lagos and Abuja. The current rate reflects local rental market dynamics and investor risk perceptions.",
            "coc_context": "Nigerian real estate investors often face higher interest rates (15-25%) and limited mortgage availability, making cash-on-cash returns particularly important. The banking sector's conservative lending practices mean many investors rely on substantial down payments.",
            "noi_context": "Nigerian rental markets show strong demand in urban centers, but investors must account for higher operational costs including security, maintenance, and potential currency fluctuations. Rental yields remain attractive compared to other investment classes.",
            "dscr_context": "Nigerian banks typically require DSCR ratios of 1.2-1.5 for real estate loans, reflecting the higher risk environment. Interest rates are significantly higher than developed markets, making debt service coverage a critical factor.",
            "terminal_value_context": "Nigerian real estate has shown strong appreciation potential, particularly in major cities, driven by urbanization, population growth, and limited supply of quality housing. However, investors should consider currency risk and economic volatility.",
            "market_conditions": "Nigerian real estate market conditions include high inflation (20-25%), currency volatility, and strong demand for quality housing in urban centers."
        }
    
    elif currency_symbol == "$" or region == "USA":
        return {
            "cap_rate_context": "US real estate cap rates vary significantly by location and property type, typically ranging from 3-7% in major markets. Current Federal Reserve interest rate policies and economic conditions heavily influence these rates.",
            "coc_context": "US real estate benefits from relatively low interest rates (6-8%) and readily available mortgage financing. The 30-year fixed-rate mortgage system provides stability for long-term investors, making cash-on-cash returns more predictable.",
            "noi_context": "US rental markets show strong fundamentals with consistent demand across most metropolitan areas. Operating expenses are generally predictable, and property management systems are well-established, providing reliable income streams.",
            "dscr_context": "US lenders typically require DSCR ratios of 1.25-1.35 for commercial real estate loans. The Federal Reserve's monetary policy directly impacts borrowing costs and investment returns across all property types.",
            "terminal_value_context": "US real estate has historically shown steady appreciation, particularly in major metropolitan areas. Population growth, job creation, and infrastructure development drive long-term value increases.",
            "market_conditions": "US real estate market conditions include moderate inflation (3-4%), stable currency, and strong institutional investment activity."
        }
    
    elif currency_symbol == "£" or region == "UK":
        return {
            "cap_rate_context": "UK real estate cap rates typically range from 3-6%, with London properties commanding lower rates due to high demand and limited supply. Brexit impacts and Bank of England policies continue to influence market dynamics.",
            "coc_context": "UK real estate investors benefit from relatively stable interest rates (4-6%) and established mortgage markets. However, recent economic uncertainty has made lenders more cautious, affecting loan-to-value ratios.",
            "noi_context": "UK rental markets show strong demand, particularly in major cities, but investors face higher operating costs including maintenance, insurance, and regulatory compliance. Rental yields vary significantly by location.",
            "dscr_context": "UK lenders typically require DSCR ratios of 1.2-1.4, with stricter requirements for higher-risk properties. The Bank of England's base rate directly impacts borrowing costs and investment viability.",
            "terminal_value_context": "UK real estate has shown strong long-term appreciation, particularly in London and major cities. However, recent market volatility and economic uncertainty have created both opportunities and risks for investors.",
            "market_conditions": "UK real estate market conditions include moderate inflation (4-6%), currency volatility post-Brexit, and strong demand for quality housing."
        }
    
    else:
        return {
            "cap_rate_context": "Cap rates in this market reflect local economic conditions, interest rates, and investor risk perceptions. Regional factors such as population growth, job creation, and infrastructure development influence these rates.",
            "coc_context": "Cash-on-cash returns in this market depend on local financing conditions, interest rates, and lending practices. Regional banking systems and economic stability play significant roles in determining investment returns.",
            "noi_context": "Net Operating Income reflects local rental market conditions, operating costs, and economic factors. Regional demand patterns and supply constraints influence income potential and expense structures.",
            "dscr_context": "Debt Service Coverage Ratios in this market depend on local lending standards, interest rates, and economic conditions. Regional banking regulations and risk assessment practices affect loan terms.",
            "terminal_value_context": "Terminal value projections reflect regional economic growth, population trends, and market development patterns. Local infrastructure investment and economic policies influence long-term appreciation potential.",
            "market_conditions": "Regional market conditions include local inflation rates, currency stability, and economic growth patterns that affect real estate investment returns."
        }

def get_investment_quality(cap_rate, cash_on_cash, dscr):
    """Assess overall investment quality."""
    if cap_rate > 0.08 and cash_on_cash > 0.12 and dscr > 1.3:
        return "exceptional"
    elif cap_rate > 0.06 and cash_on_cash > 0.08 and dscr > 1.2:
        return "strong"
    elif cap_rate > 0.04 and cash_on_cash > 0.06 and dscr > 1.1:
        return "moderate"
    else:
        return "conservative"

def get_cap_rate_assessment(cap_rate, market_context):
    """Assess cap rate performance."""
    if cap_rate > 0.08:
        return "strong income generation potential"
    elif cap_rate > 0.06:
        return "solid income generation"
    elif cap_rate > 0.04:
        return "moderate income generation"
    else:
        return "lower income generation but potential for appreciation"

def get_coc_assessment(cash_on_cash, market_context):
    """Assess cash-on-cash return."""
    if cash_on_cash > 0.12:
        return "excellent returns on invested capital"
    elif cash_on_cash > 0.08:
        return "strong returns on invested capital"
    elif cash_on_cash > 0.06:
        return "reasonable returns on invested capital"
    else:
        return "modest returns on invested capital"

def get_noi_assessment(noi, market_context):
    """Assess NOI performance."""
    if noi > 0:
        return "positive cash flow generation"
    else:
        return "negative cash flow, requiring careful analysis"

def get_dscr_assessment(dscr):
    """Assess DSCR performance."""
    if dscr > 1.5:
        return "excellent debt coverage with significant safety margin"
    elif dscr > 1.25:
        return "strong debt coverage with adequate safety margin"
    elif dscr > 1.1:
        return "adequate debt coverage with minimal safety margin"
    else:
        return "weak debt coverage requiring careful monitoring"

def get_terminal_value_assessment(terminal_value, market_context):
    """Assess terminal value potential."""
    return "strong appreciation potential based on market fundamentals and growth projections"

def get_overall_recommendation(cap_rate, cash_on_cash, dscr, market_context):
    """Generate overall investment recommendation."""
    if cap_rate > 0.06 and cash_on_cash > 0.08 and dscr > 1.2:
        return "RECOMMENDATION: This property presents a compelling investment opportunity with strong fundamentals across all key metrics. The combination of solid income generation, good cash returns, and healthy debt coverage makes this an attractive addition to a real estate portfolio."
    elif cap_rate > 0.04 and cash_on_cash > 0.06 and dscr > 1.1:
        return "RECOMMENDATION: This property offers a balanced investment opportunity with moderate risk and return potential. While not exceptional, the metrics suggest a stable investment suitable for conservative investors or as part of a diversified portfolio."
    else:
        return "RECOMMENDATION: This property requires careful consideration due to lower performance metrics. While it may offer other benefits such as location or appreciation potential, investors should thoroughly evaluate all factors before proceeding."

def format_currency(amount, currency_symbol):
    """Format currency with symbol and commas."""
    return f"{currency_symbol}{amount:,.2f}"
