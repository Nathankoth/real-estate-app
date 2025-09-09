"""
Backtesting engine for VistaForge ROI Calculator
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)

class BacktestEngine:
    """
    Backtesting engine for real estate investment analysis
    """
    
    def __init__(self):
        self.scenarios = {}
    
    def run_backtest(self, property_data: Dict[str, Any], transactions: List[Dict[str, Any]], 
                    start_date: str, end_date: str, scenarios: Optional[List[Dict[str, Any]]] = None) -> Dict[str, Any]:
        """
        Run backtesting analysis for a property
        
        Args:
            property_data: Property information
            transactions: Historical transaction data
            start_date: Start date for backtesting (YYYY-MM-DD)
            end_date: End date for backtesting (YYYY-MM-DD)
            scenarios: Optional scenario analysis parameters
            
        Returns:
            Dictionary with backtesting results
        """
        try:
            # Convert dates
            start_dt = datetime.strptime(start_date, "%Y-%m-%d")
            end_dt = datetime.strptime(end_date, "%Y-%m-%d")
            
            # Filter transactions by date range
            filtered_transactions = self._filter_transactions_by_date(transactions, start_dt, end_dt)
            
            # Calculate base metrics
            base_results = self._calculate_base_metrics(property_data, filtered_transactions)
            
            # Run scenario analysis if provided
            scenario_results = {}
            if scenarios:
                scenario_results = self._run_scenario_analysis(property_data, filtered_transactions, scenarios)
            
            # Calculate performance metrics
            performance_metrics = self._calculate_performance_metrics(filtered_transactions, property_data)
            
            # Generate insights
            insights = self._generate_insights(base_results, performance_metrics, scenario_results)
            
            return {
                "base_results": base_results,
                "scenario_results": scenario_results,
                "performance_metrics": performance_metrics,
                "insights": insights,
                "period": {
                    "start_date": start_date,
                    "end_date": end_date,
                    "duration_days": (end_dt - start_dt).days
                }
            }
            
        except Exception as e:
            logger.error(f"Backtesting error: {str(e)}")
            raise
    
    def _filter_transactions_by_date(self, transactions: List[Dict[str, Any]], 
                                   start_date: datetime, end_date: datetime) -> List[Dict[str, Any]]:
        """Filter transactions by date range"""
        filtered = []
        for transaction in transactions:
            trans_date = datetime.strptime(transaction['transaction_date'], "%Y-%m-%d")
            if start_date <= trans_date <= end_date:
                filtered.append(transaction)
        return filtered
    
    def _calculate_base_metrics(self, property_data: Dict[str, Any], 
                              transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate base performance metrics"""
        if not transactions:
            return {"error": "No transactions found for the specified period"}
        
        # Convert transactions to DataFrame for easier analysis
        df = pd.DataFrame(transactions)
        df['transaction_date'] = pd.to_datetime(df['transaction_date'])
        df['amount'] = pd.to_numeric(df['amount'])
        
        # Calculate totals by transaction type
        income_transactions = df[df['transaction_type'] == 'rent']
        expense_transactions = df[df['transaction_type'] == 'expense']
        
        total_income = income_transactions['amount'].sum()
        total_expenses = abs(expense_transactions['amount'].sum())
        net_cash_flow = total_income - total_expenses
        
        # Calculate monthly averages
        months = (df['transaction_date'].max() - df['transaction_date'].min()).days / 30.44
        monthly_income = total_income / months if months > 0 else 0
        monthly_expenses = total_expenses / months if months > 0 else 0
        monthly_cash_flow = monthly_income - monthly_expenses
        
        # Calculate occupancy rate (simplified)
        expected_rent = property_data.get('gross_rent_annual', 0) / 12
        occupancy_rate = (monthly_income / expected_rent) if expected_rent > 0 else 0
        
        return {
            "total_income": round(total_income, 2),
            "total_expenses": round(total_expenses, 2),
            "net_cash_flow": round(net_cash_flow, 2),
            "monthly_income": round(monthly_income, 2),
            "monthly_expenses": round(monthly_expenses, 2),
            "monthly_cash_flow": round(monthly_cash_flow, 2),
            "occupancy_rate": round(occupancy_rate, 4),
            "transaction_count": len(transactions),
            "period_months": round(months, 1)
        }
    
    def _run_scenario_analysis(self, property_data: Dict[str, Any], 
                             transactions: List[Dict[str, Any]], 
                             scenarios: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Run scenario analysis"""
        scenario_results = {}
        
        for scenario in scenarios:
            scenario_name = scenario.get('name', 'Unnamed Scenario')
            scenario_params = scenario.get('parameters', {})
            
            # Apply scenario parameters to property data
            modified_property = property_data.copy()
            for param, value in scenario_params.items():
                if param in modified_property:
                    if param == 'gross_rent_annual':
                        # Apply percentage change
                        if isinstance(value, str) and value.endswith('%'):
                            percentage = float(value[:-1]) / 100
                            modified_property[param] *= (1 + percentage)
                        else:
                            modified_property[param] = value
                    elif param == 'vacancy_rate':
                        modified_property[param] = value
                    elif param == 'operating_expenses':
                        if isinstance(value, str) and value.endswith('%'):
                            percentage = float(value[:-1]) / 100
                            modified_property[param] *= (1 + percentage)
                        else:
                            modified_property[param] = value
            
            # Recalculate metrics with modified parameters
            scenario_metrics = self._calculate_scenario_metrics(modified_property, transactions)
            scenario_results[scenario_name] = scenario_metrics
        
        return scenario_results
    
    def _calculate_scenario_metrics(self, property_data: Dict[str, Any], 
                                  transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate metrics for a specific scenario"""
        # This is a simplified scenario calculation
        # In a real implementation, you would recalculate ROI metrics with modified parameters
        
        base_metrics = self._calculate_base_metrics(property_data, transactions)
        
        # Apply scenario-specific adjustments
        adjusted_metrics = base_metrics.copy()
        
        # Example: Adjust cash flow based on rent changes
        rent_multiplier = property_data.get('gross_rent_annual', 60000) / 60000  # Normalize to base
        adjusted_metrics['monthly_cash_flow'] *= rent_multiplier
        adjusted_metrics['net_cash_flow'] *= rent_multiplier
        
        return adjusted_metrics
    
    def _calculate_performance_metrics(self, transactions: List[Dict[str, Any]], 
                                     property_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate performance metrics"""
        if not transactions:
            return {}
        
        df = pd.DataFrame(transactions)
        df['transaction_date'] = pd.to_datetime(df['transaction_date'])
        df['amount'] = pd.to_numeric(df['amount'])
        
        # Calculate monthly cash flows
        monthly_cash_flows = df.groupby(df['transaction_date'].dt.to_period('M'))['amount'].sum()
        
        # Calculate performance metrics
        total_return = df['amount'].sum()
        average_monthly_return = monthly_cash_flows.mean()
        return_volatility = monthly_cash_flows.std()
        
        # Calculate Sharpe ratio (simplified)
        risk_free_rate = 0.02  # 2% annual risk-free rate
        monthly_risk_free = risk_free_rate / 12
        sharpe_ratio = (average_monthly_return - monthly_risk_free) / return_volatility if return_volatility > 0 else 0
        
        # Calculate maximum drawdown
        cumulative_returns = monthly_cash_flows.cumsum()
        running_max = cumulative_returns.expanding().max()
        drawdown = cumulative_returns - running_max
        max_drawdown = drawdown.min()
        
        return {
            "total_return": round(total_return, 2),
            "average_monthly_return": round(average_monthly_return, 2),
            "return_volatility": round(return_volatility, 2),
            "sharpe_ratio": round(sharpe_ratio, 4),
            "max_drawdown": round(max_drawdown, 2),
            "months_analyzed": len(monthly_cash_flows)
        }
    
    def _generate_insights(self, base_results: Dict[str, Any], 
                         performance_metrics: Dict[str, Any], 
                         scenario_results: Dict[str, Any]) -> Dict[str, Any]:
        """Generate insights from backtesting results"""
        insights = {
            "summary": [],
            "recommendations": [],
            "risks": [],
            "opportunities": []
        }
        
        # Analyze base results
        if base_results.get('monthly_cash_flow', 0) > 0:
            insights["summary"].append("Property generated positive cash flow during the analysis period")
        else:
            insights["risks"].append("Property had negative cash flow during the analysis period")
        
        if base_results.get('occupancy_rate', 0) > 0.9:
            insights["summary"].append("High occupancy rate achieved")
        elif base_results.get('occupancy_rate', 0) < 0.8:
            insights["risks"].append("Low occupancy rate may indicate market or management issues")
        
        # Analyze performance metrics
        if performance_metrics.get('sharpe_ratio', 0) > 1:
            insights["summary"].append("Good risk-adjusted returns")
        elif performance_metrics.get('sharpe_ratio', 0) < 0:
            insights["risks"].append("Poor risk-adjusted returns")
        
        if performance_metrics.get('max_drawdown', 0) < -10000:
            insights["risks"].append("Significant cash flow volatility observed")
        
        # Analyze scenarios
        if scenario_results:
            best_scenario = max(scenario_results.items(), 
                              key=lambda x: x[1].get('monthly_cash_flow', 0))
            worst_scenario = min(scenario_results.items(), 
                               key=lambda x: x[1].get('monthly_cash_flow', 0))
            
            insights["opportunities"].append(f"Best performing scenario: {best_scenario[0]}")
            insights["risks"].append(f"Worst performing scenario: {worst_scenario[0]}")
        
        # Generate recommendations
        if base_results.get('occupancy_rate', 0) < 0.85:
            insights["recommendations"].append("Consider improving property management to increase occupancy")
        
        if base_results.get('monthly_expenses', 0) > base_results.get('monthly_income', 0) * 0.5:
            insights["recommendations"].append("Review operating expenses - they may be too high relative to income")
        
        if performance_metrics.get('return_volatility', 0) > 2000:
            insights["recommendations"].append("Consider strategies to stabilize cash flow")
        
        return insights
    
    def calculate_portfolio_backtest(self, properties: List[Dict[str, Any]], 
                                   start_date: str, end_date: str) -> Dict[str, Any]:
        """Calculate portfolio-level backtesting"""
        portfolio_results = {
            "total_properties": len(properties),
            "aggregate_metrics": {},
            "property_results": [],
            "portfolio_insights": []
        }
        
        total_income = 0
        total_expenses = 0
        total_cash_flow = 0
        
        for property_data in properties:
            # This would need to be implemented with actual transaction data
            # For now, return placeholder results
            property_result = {
                "property_id": property_data.get('id'),
                "property_name": property_data.get('property_name'),
                "monthly_cash_flow": 0,  # Placeholder
                "occupancy_rate": 0.9,   # Placeholder
                "performance_rating": "Good"
            }
            portfolio_results["property_results"].append(property_result)
        
        portfolio_results["aggregate_metrics"] = {
            "total_monthly_cash_flow": total_cash_flow,
            "average_occupancy_rate": 0.9,
            "portfolio_performance": "Good"
        }
        
        return portfolio_results

# Example usage
if __name__ == "__main__":
    # Sample data for testing
    sample_property = {
        'id': 1,
        'purchase_price': 500000,
        'gross_rent_annual': 60000,
        'vacancy_rate': 0.05,
        'operating_expenses': 15000,
        'annual_mortgage_payment': 30000,
        'equity': 100000
    }
    
    sample_transactions = [
        {
            'transaction_date': '2024-01-15',
            'transaction_type': 'rent',
            'amount': 5000,
            'description': 'Monthly rent',
            'category': 'income'
        },
        {
            'transaction_date': '2024-01-15',
            'transaction_type': 'expense',
            'amount': -1250,
            'description': 'Operating expenses',
            'category': 'operating'
        },
        {
            'transaction_date': '2024-01-15',
            'transaction_type': 'expense',
            'amount': -2500,
            'description': 'Mortgage payment',
            'category': 'debt_service'
        }
    ]
    
    # Initialize backtest engine
    engine = BacktestEngine()
    
    # Run backtest
    results = engine.run_backtest(
        sample_property,
        sample_transactions,
        '2024-01-01',
        '2024-12-31',
        [
            {
                'name': 'Optimistic',
                'parameters': {'gross_rent_annual': '+10%'}
            },
            {
                'name': 'Pessimistic',
                'parameters': {'gross_rent_annual': '-10%'}
            }
        ]
    )
    
    print("Backtesting Results:")
    print("=" * 40)
    print(f"Base Results: {results['base_results']}")
    print(f"Performance Metrics: {results['performance_metrics']}")
    print(f"Insights: {results['insights']}")
