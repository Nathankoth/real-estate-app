"""
Streamlit UI for VistaForge ROI Calculator
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from datetime import datetime, timedelta
import requests
import json
from typing import Dict, Any, List

# Page configuration
st.set_page_config(
    page_title="VistaForge ROI Calculator",
    page_icon="🏠",
    layout="wide",
    initial_sidebar_state="expanded"
)

# API configuration
API_BASE_URL = "http://localhost:8000"

def make_api_request(endpoint: str, method: str = "GET", data: Dict = None) -> Dict:
    """Make API request to backend"""
    try:
        url = f"{API_BASE_URL}{endpoint}"
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        elif method == "DELETE":
            response = requests.delete(url)
        
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        st.error(f"API Error: {str(e)}")
        return {"success": False, "error": str(e)}

def main():
    """Main Streamlit application"""
    
    # Header
    st.title("🏠 VistaForge ROI Calculator")
    st.markdown("Advanced real estate investment analysis and portfolio management")
    
    # Sidebar navigation
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Choose a page",
        ["Dashboard", "ROI Calculator", "Property Management", "Portfolio Analysis", "Backtesting"]
    )
    
    # Check API health
    health = make_api_request("/health")
    if health.get("status") == "healthy":
        st.sidebar.success("✅ API Connected")
    else:
        st.sidebar.error("❌ API Disconnected")
        st.error("Please ensure the API server is running on localhost:8000")
        return
    
    # Route to appropriate page
    if page == "Dashboard":
        show_dashboard()
    elif page == "ROI Calculator":
        show_roi_calculator()
    elif page == "Property Management":
        show_property_management()
    elif page == "Portfolio Analysis":
        show_portfolio_analysis()
    elif page == "Backtesting":
        show_backtesting()

def show_dashboard():
    """Dashboard overview"""
    st.header("📊 Dashboard")
    
    # Get portfolio metrics
    portfolio_data = make_api_request("/roi/portfolio")
    
    if portfolio_data.get("success"):
        metrics = portfolio_data["portfolio_metrics"]
        
        # Key metrics
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric(
                "Total Properties",
                metrics.get("total_properties", 0)
            )
        
        with col2:
            st.metric(
                "Total Investment",
                f"${metrics.get('total_investment', 0):,.0f}"
            )
        
        with col3:
            st.metric(
                "Monthly Cash Flow",
                f"${metrics.get('total_monthly_cash_flow', 0):,.0f}"
            )
        
        with col4:
            st.metric(
                "Portfolio Cap Rate",
                f"{metrics.get('weighted_average_cap_rate', 0)*100:.2f}%"
            )
        
        # Recent properties
        st.subheader("Recent Properties")
        properties_data = make_api_request("/roi/properties")
        
        if properties_data.get("success"):
            properties = properties_data["data"]
            
            if properties:
                # Create DataFrame for display
                df_data = []
                for item in properties:
                    prop = item["property"]
                    roi = item["roi_results"]
                    df_data.append({
                        "ID": prop["id"],
                        "Name": prop.get("property_name", "N/A"),
                        "Address": prop.get("address", "N/A"),
                        "Purchase Price": f"${prop['purchase_price']:,.0f}",
                        "Cap Rate": f"{roi['cap_rate']*100:.2f}%" if roi else "N/A",
                        "Cash Flow": f"${roi['pre_tax_cash_flow']:,.0f}" if roi else "N/A",
                        "Created": prop["created_at"][:10]
                    })
                
                df = pd.DataFrame(df_data)
                st.dataframe(df, use_container_width=True)
            else:
                st.info("No properties found. Add your first property using the ROI Calculator.")
        else:
            st.error("Failed to load properties")
    
    else:
        st.error("Failed to load portfolio metrics")

def show_roi_calculator():
    """ROI Calculator interface"""
    st.header("🧮 ROI Calculator")
    
    # Input form
    with st.form("roi_calculator_form"):
        st.subheader("Property Details")
        
        col1, col2 = st.columns(2)
        
        with col1:
            property_name = st.text_input("Property Name", placeholder="e.g., 123 Main St")
            address = st.text_input("Address")
            city = st.text_input("City")
            state = st.text_input("State")
            zip_code = st.text_input("ZIP Code")
            property_type = st.selectbox("Property Type", ["residential", "commercial", "mixed-use"])
        
        with col2:
            purchase_price = st.number_input("Purchase Price ($)", min_value=0, value=500000)
            gross_rent_annual = st.number_input("Annual Gross Rent ($)", min_value=0, value=60000)
            vacancy_rate = st.slider("Vacancy Rate (%)", 0.0, 20.0, 5.0) / 100
            operating_expenses = st.number_input("Annual Operating Expenses ($)", min_value=0, value=15000)
            annual_mortgage_payment = st.number_input("Annual Mortgage Payment ($)", min_value=0, value=30000)
            equity = st.number_input("Equity/Down Payment ($)", min_value=0, value=100000)
        
        # Advanced options
        with st.expander("Advanced Options"):
            col3, col4 = st.columns(2)
            
            with col3:
                interest_rate = st.number_input("Interest Rate (%)", 0.0, 20.0, 6.5) / 100
                loan_term_years = st.number_input("Loan Term (Years)", 1, 50, 30)
                property_taxes = st.number_input("Property Taxes ($)", min_value=0, value=8000)
            
            with col4:
                insurance = st.number_input("Insurance ($)", min_value=0, value=2000)
                maintenance = st.number_input("Maintenance ($)", min_value=0, value=3000)
                management_fee = st.number_input("Management Fee ($)", min_value=0, value=3000)
        
        submitted = st.form_submit_button("Calculate ROI", type="primary")
    
    if submitted:
        # Prepare data
        property_data = {
            "property_name": property_name,
            "address": address,
            "city": city,
            "state": state,
            "zip_code": zip_code,
            "property_type": property_type,
            "purchase_price": purchase_price,
            "gross_rent_annual": gross_rent_annual,
            "vacancy_rate": vacancy_rate,
            "operating_expenses": operating_expenses,
            "annual_mortgage_payment": annual_mortgage_payment,
            "equity": equity,
            "interest_rate": interest_rate,
            "loan_term_years": loan_term_years,
            "property_taxes": property_taxes,
            "insurance": insurance,
            "maintenance": maintenance,
            "management_fee": management_fee
        }
        
        # Calculate ROI
        with st.spinner("Calculating ROI..."):
            result = make_api_request("/roi/calculate", "POST", property_data)
        
        if result.get("success"):
            roi_data = result["data"]
            
            # Display results
            st.success("ROI calculation completed!")
            
            # Key metrics
            col1, col2, col3, col4 = st.columns(4)
            
            with col1:
                st.metric("Cap Rate", f"{roi_data['cap_rate']*100:.2f}%")
            
            with col2:
                st.metric("Cash-on-Cash", f"{roi_data['cash_on_cash_return']*100:.2f}%")
            
            with col3:
                st.metric("DSCR", f"{roi_data['debt_service_coverage_ratio']:.2f}")
            
            with col4:
                st.metric("IRR", f"{roi_data['irr']*100:.2f}%")
            
            # Detailed metrics
            st.subheader("Detailed Analysis")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.write("**Financial Metrics**")
                st.write(f"• Effective Gross Income: ${roi_data['effective_gross_income']:,.2f}")
                st.write(f"• Net Operating Income: ${roi_data['net_operating_income']:,.2f}")
                st.write(f"• Pre-Tax Cash Flow: ${roi_data['pre_tax_cash_flow']:,.2f}")
                st.write(f"• Gross Yield: {roi_data['gross_yield']*100:.2f}%")
                st.write(f"• Payback Period: {roi_data['payback_period_years']:.1f} years")
            
            with col2:
                st.write("**Investment Analysis**")
                analysis = roi_data.get('investment_analysis', {})
                st.write(f"• Overall Rating: **{analysis.get('overall_rating', 'N/A')}**")
                
                if analysis.get('strengths'):
                    st.write("• Strengths:")
                    for strength in analysis['strengths']:
                        st.write(f"  - {strength}")
                
                if analysis.get('risks'):
                    st.write("• Risks:")
                    for risk in analysis['risks']:
                        st.write(f"  - {risk}")
            
            # Save property option
            if st.button("Save Property to Database"):
                with st.spinner("Saving property..."):
                    save_result = make_api_request("/roi/property", "POST", property_data)
                
                if save_result.get("success"):
                    st.success(f"Property saved with ID: {save_result['property_id']}")
                else:
                    st.error("Failed to save property")
        
        else:
            st.error(f"ROI calculation failed: {result.get('error', 'Unknown error')}")

def show_property_management():
    """Property management interface"""
    st.header("🏘️ Property Management")
    
    # Get all properties
    properties_data = make_api_request("/roi/properties")
    
    if properties_data.get("success"):
        properties = properties_data["data"]
        
        if properties:
            # Property selector
            property_options = {
                f"{prop['property']['id']}: {prop['property'].get('property_name', 'Unnamed')}": prop['property']['id']
                for prop in properties
            }
            
            selected_property = st.selectbox("Select Property", list(property_options.keys()))
            property_id = property_options[selected_property]
            
            # Get selected property data
            selected_prop_data = next(
                prop for prop in properties 
                if prop['property']['id'] == property_id
            )
            
            prop = selected_prop_data['property']
            roi = selected_prop_data['roi_results']
            
            # Property details
            st.subheader("Property Details")
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.write(f"**Name:** {prop.get('property_name', 'N/A')}")
                st.write(f"**Address:** {prop.get('address', 'N/A')}")
                st.write(f"**City:** {prop.get('city', 'N/A')}")
                st.write(f"**State:** {prop.get('state', 'N/A')}")
                st.write(f"**ZIP:** {prop.get('zip_code', 'N/A')}")
            
            with col2:
                st.write(f"**Purchase Price:** ${prop['purchase_price']:,.2f}")
                st.write(f"**Annual Rent:** ${prop['gross_rent_annual']:,.2f}")
                st.write(f"**Operating Expenses:** ${prop['operating_expenses']:,.2f}")
                st.write(f"**Equity:** ${prop['equity']:,.2f}")
                st.write(f"**Created:** {prop['created_at'][:10]}")
            
            # ROI metrics
            if roi:
                st.subheader("ROI Metrics")
                
                col1, col2, col3, col4 = st.columns(4)
                
                with col1:
                    st.metric("Cap Rate", f"{roi['cap_rate']*100:.2f}%")
                
                with col2:
                    st.metric("Cash-on-Cash", f"{roi['cash_on_cash_return']*100:.2f}%")
                
                with col3:
                    st.metric("DSCR", f"{roi['debt_service_coverage_ratio']:.2f}")
                
                with col4:
                    st.metric("IRR", f"{roi['irr']*100:.2f}%")
            
            # Actions
            col1, col2, col3 = st.columns(3)
            
            with col1:
                if st.button("Recalculate ROI"):
                    with st.spinner("Recalculating..."):
                        result = make_api_request(f"/roi/property/{property_id}/calculate", "POST")
                    
                    if result.get("success"):
                        st.success("ROI recalculated successfully!")
                        st.rerun()
                    else:
                        st.error("Failed to recalculate ROI")
            
            with col2:
                if st.button("View Transactions"):
                    transactions_data = make_api_request(f"/roi/property/{property_id}/transactions")
                    
                    if transactions_data.get("success"):
                        transactions = transactions_data["transactions"]
                        
                        if transactions:
                            st.subheader("Transactions")
                            df = pd.DataFrame(transactions)
                            st.dataframe(df, use_container_width=True)
                        else:
                            st.info("No transactions found for this property")
                    else:
                        st.error("Failed to load transactions")
            
            with col3:
                if st.button("Delete Property", type="secondary"):
                    if st.session_state.get('confirm_delete') == property_id:
                        with st.spinner("Deleting property..."):
                            result = make_api_request(f"/roi/property/{property_id}", "DELETE")
                        
                        if result.get("success"):
                            st.success("Property deleted successfully!")
                            st.rerun()
                        else:
                            st.error("Failed to delete property")
                    else:
                        st.session_state['confirm_delete'] = property_id
                        st.warning("Click again to confirm deletion")
        else:
            st.info("No properties found. Use the ROI Calculator to add your first property.")
    else:
        st.error("Failed to load properties")

def show_portfolio_analysis():
    """Portfolio analysis interface"""
    st.header("📈 Portfolio Analysis")
    
    # Get portfolio metrics
    portfolio_data = make_api_request("/roi/portfolio")
    
    if portfolio_data.get("success"):
        metrics = portfolio_data["portfolio_metrics"]
        
        # Portfolio overview
        st.subheader("Portfolio Overview")
        
        col1, col2, col3, col4 = st.columns(4)
        
        with col1:
            st.metric("Total Properties", metrics.get("total_properties", 0))
        
        with col2:
            st.metric("Total Investment", f"${metrics.get('total_investment', 0):,.0f}")
        
        with col3:
            st.metric("Total Equity", f"${metrics.get('total_equity', 0):,.0f}")
        
        with col4:
            st.metric("Monthly Cash Flow", f"${metrics.get('total_monthly_cash_flow', 0):,.0f}")
        
        # Performance metrics
        st.subheader("Performance Metrics")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.metric("Weighted Cap Rate", f"{metrics.get('weighted_average_cap_rate', 0)*100:.2f}%")
        
        with col2:
            st.metric("Portfolio Cash-on-Cash", f"{metrics.get('portfolio_cash_on_cash', 0)*100:.2f}%")
        
        with col3:
            st.metric("Annual Cash Flow", f"${metrics.get('total_annual_cash_flow', 0):,.0f}")
        
        # Property distribution chart
        properties_data = make_api_request("/roi/properties")
        
        if properties_data.get("success"):
            properties = properties_data["data"]
            
            if properties:
                # Create charts
                col1, col2 = st.columns(2)
                
                with col1:
                    # Investment by property
                    prop_data = []
                    for item in properties:
                        prop = item["property"]
                        prop_data.append({
                            "Property": prop.get("property_name", f"Property {prop['id']}"),
                            "Investment": prop["purchase_price"]
                        })
                    
                    df = pd.DataFrame(prop_data)
                    fig = px.pie(df, values="Investment", names="Property", title="Investment Distribution")
                    st.plotly_chart(fig, use_container_width=True)
                
                with col2:
                    # Cap rate comparison
                    cap_data = []
                    for item in properties:
                        prop = item["property"]
                        roi = item["roi_results"]
                        if roi:
                            cap_data.append({
                                "Property": prop.get("property_name", f"Property {prop['id']}"),
                                "Cap Rate": roi["cap_rate"] * 100
                            })
                    
                    if cap_data:
                        df = pd.DataFrame(cap_data)
                        fig = px.bar(df, x="Property", y="Cap Rate", title="Cap Rate Comparison")
                        st.plotly_chart(fig, use_container_width=True)
    else:
        st.error("Failed to load portfolio data")

def show_backtesting():
    """Backtesting interface"""
    st.header("📊 Backtesting Analysis")
    
    st.info("Backtesting feature coming soon! This will allow you to analyze historical performance and run scenario analysis.")
    
    # Placeholder for backtesting interface
    st.subheader("Scenario Analysis")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.write("**Market Scenarios**")
        st.write("• Base case scenario")
        st.write("• Optimistic scenario (+20% rent)")
        st.write("• Pessimistic scenario (-20% rent)")
        st.write("• High vacancy scenario (15% vacancy)")
    
    with col2:
        st.write("**Sensitivity Analysis**")
        st.write("• Interest rate changes")
        st.write("• Property value appreciation")
        st.write("• Operating expense variations")
        st.write("• Market rent fluctuations")

if __name__ == "__main__":
    main()
