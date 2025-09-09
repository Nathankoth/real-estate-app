# ui_streamlit.py
import streamlit as st
from roi_engine import compute_roi_from_inputs

st.set_page_config(page_title="ROI Calculator", layout="wide")

st.title("ROI Calculator — Simple & Advanced")

mode = st.sidebar.radio("Mode", ["Simple", "Advanced"])

def simple_ui():
    st.header("Simple Calculator")
    purchase_price = st.number_input("Purchase price (₦)", value=50_000_000.0, step=100_000.0, format="%.0f")
    monthly_rent = st.number_input("Monthly rent (₦)", value=250_000.0, step=10_000.0, format="%.0f")
    use_finance = st.checkbox("Using mortgage/loan?", True)
    renovation = st.number_input("Renovation / CapEx (₦)", value=0.0, step=10_000.0, format="%.0f")
    hold_years = st.slider("Hold (years)", 1, 20, 5)
    vacancy_default = 0.10
    if use_finance:
        annual_mortgage = st.number_input("Estimated annual mortgage payment (₦)", value=1_800_000.0, step=10_000.0, format="%.0f")
    else:
        annual_mortgage = 0.0

    if st.button("Calculate ROI (Simple)"):
        inputs = {
            "purchase_price": purchase_price,
            "gross_rent_annual": monthly_rent * 12,
            "vacancy_rate": vacancy_default,
            "operating_expenses": (monthly_rent*12) * 0.20,  # default OER
            "annual_mortgage_payment": annual_mortgage,
            "equity": purchase_price * 0.20,
            "hold_years": hold_years,
            "renovation_cost": renovation
        }
        results = compute_roi_from_inputs(inputs, local_refs={'cap_low':0.03,'cap_high':0.08,'coc_target':0.08,'dscr_min':1.2,'discount_rate':0.10})
        st.metric("Cap rate", f"{results['cap_rate']*100:.2f}%")
        st.metric("Cash-on-Cash", f"{results['cash_on_cash']*100:.2f}%")
        st.metric("NOI (₦)", f"₦{results['noi']:,.0f}")
        st.write("Explanation:")
        for line in results["explanation"]:
            st.write("- ", line)
        st.write("Cash flows (sample):", results["cash_flows"])

def advanced_ui():
    st.header("Advanced Calculator")
    with st.form("advanced"):
        purchase_price = st.number_input("Purchase price (₦)", value=50_000_000.0, format="%.0f")
        gross_rent_annual = st.number_input("Gross annual rent (₦)", value=3_000_000.0, format="%.0f")
        vacancy_rate = st.number_input("Vacancy rate (decimal)", value=0.10, step=0.01, format="%.2f")
        operating_expenses = st.number_input("Operating expenses (₦)", value=600_000.0, format="%.0f")
        annual_mortgage = st.number_input("Annual mortgage payment (₦)", value=1_800_000.0, format="%.0f")
        equity = st.number_input("Equity (₦)", value=purchase_price*0.20, format="%.0f")
        renovation = st.number_input("Renovation / CapEx (₦)", value=0.0, format="%.0f")
        hold_years = st.number_input("Hold years", value=5, min_value=1, max_value=30)
        cap_low = st.number_input("Local cap rate lower bound (decimal)", value=0.03, format="%.2f")
        cap_high = st.number_input("Local cap rate upper bound (decimal)", value=0.08, format="%.2f")
        coc_target = st.number_input("Target cash-on-cash (decimal)", value=0.08, format="%.2f")
        dscr_min = st.number_input("Lender DSCR min", value=1.2, format="%.2f")
        discount_rate = st.number_input("Discount rate for NPV (decimal)", value=0.10, format="%.2f")
        submitted = st.form_submit_button("Calculate (Advanced)")

    if submitted:
        inputs = {
            "purchase_price": purchase_price,
            "gross_rent_annual": gross_rent_annual,
            "vacancy_rate": vacancy_rate,
            "operating_expenses": operating_expenses,
            "annual_mortgage_payment": annual_mortgage,
            "equity": equity,
            "hold_years": int(hold_years),
            "renovation_cost": renovation
        }
        local_refs = {'cap_low':cap_low, 'cap_high':cap_high, 'coc_target':coc_target, 'dscr_min':dscr_min, 'discount_rate':discount_rate}
        results = compute_roi_from_inputs(inputs, local_refs=local_refs)
        st.metric("Cap rate", f"{results['cap_rate']*100:.2f}%")
        st.metric("Cash-on-Cash", f"{results['cash_on_cash']*100:.2f}%")
        st.metric("IRR", f"{results['irr']}")
        st.write("Detailed Explanation:")
        for line in results["explanation"]:
            st.write("- ", line)
        st.write("Cash flows:", results["cash_flows"])

if mode == "Simple":
    simple_ui()
else:
    advanced_ui()
