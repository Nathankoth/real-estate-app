def format_currency(amount: float, currency_symbol: str = "₦") -> str:
    """
    Format currency amount with proper symbol and formatting.
    
    Args:
        amount (float): The amount to format
        currency_symbol (str): Currency symbol (default: ₦)
    
    Returns:
        str: Formatted currency string
    """
    if amount == 0:
        return f"{currency_symbol}0"
    
    # Format with commas for thousands
    formatted_amount = f"{amount:,.2f}"
    
    # Remove decimal places if it's a whole number
    if formatted_amount.endswith(".00"):
        formatted_amount = formatted_amount[:-3]
    
    return f"{currency_symbol}{formatted_amount}"

def format_percentage(value: float, decimal_places: int = 2) -> str:
    """
    Format percentage value.
    
    Args:
        value (float): The percentage value (as decimal, e.g., 0.05 for 5%)
        decimal_places (int): Number of decimal places
    
    Returns:
        str: Formatted percentage string
    """
    return f"{value * 100:.{decimal_places}f}%"

def get_currency_symbol(region: str = "Nigeria") -> str:
    """
    Get currency symbol based on region.
    
    Args:
        region (str): The region/country
    
    Returns:
        str: Currency symbol
    """
    currency_map = {
        "Nigeria": "₦",
        "USA": "$",
        "United States": "$",
        "UK": "£",
        "United Kingdom": "£",
        "Canada": "C$",
        "Australia": "A$",
        "Europe": "€",
        "EU": "€"
    }
    
    return currency_map.get(region, "$")