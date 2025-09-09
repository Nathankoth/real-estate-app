# VistaForge ROI Calculator

A comprehensive real estate investment analysis tool with advanced ROI calculations, backtesting capabilities, and interactive UI.

## Features

- **Advanced ROI Calculations**: Cap rate, cash-on-cash return, DSCR, NPV, IRR
- **Database Integration**: PostgreSQL with property management
- **Backtesting**: Historical performance analysis
- **Interactive UI**: Streamlit-based dashboard
- **REST API**: FastAPI endpoints for integration
- **Sample Data**: Pre-loaded transaction examples

## Quick Start

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Setup Environment**
   ```bash
   cp .env.template .env
   # Edit .env with your database credentials
   ```

3. **Initialize Database**
   ```bash
   python db.py --init
   ```

4. **Run Streamlit UI**
   ```bash
   streamlit run ui_streamlit.py
   ```

5. **Run API Server**
   ```bash
   python api.py
   ```

## File Structure

```
roi_calculator/
├─ README.md              # This file
├─ requirements.txt       # Python dependencies
├─ .env.template         # Environment variables template
├─ db_schema.sql         # Database schema
├─ sample_transactions.csv # Sample transaction data
├─ roi_engine.py         # Core ROI calculation engine
├─ db.py                 # Database utilities
├─ api.py                # FastAPI server
├─ ui_streamlit.py       # Streamlit dashboard
└─ backtest.py           # Backtesting engine
```

## API Endpoints

- `GET /health` - Health check
- `POST /roi/calculate` - Calculate ROI for property
- `POST /roi/property` - Create new property
- `GET /roi/property/{id}` - Get property details
- `GET /roi/properties` - List all properties
- `POST /roi/backtest` - Run backtesting analysis

## ROI Metrics

- **Cap Rate**: NOI / Purchase Price
- **Cash-on-Cash**: Annual Cash Flow / Equity
- **DSCR**: NOI / Annual Debt Service
- **NPV**: Net Present Value
- **IRR**: Internal Rate of Return
- **Gross Yield**: Annual Rent / Purchase Price

## Database Schema

The system uses PostgreSQL with the following tables:
- `property_inputs` - Property data
- `property_roi_results` - Calculated metrics
- `transactions` - Historical transaction data

## Environment Variables

```env
DB_NAME=vistaforge_roi
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
OPENAI_API_KEY=your_openai_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
