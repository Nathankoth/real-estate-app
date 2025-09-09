import pandas as pd
import numpy as np
from datetime import datetime
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error

def load_data():
    return pd.read_csv("sample_transactions.csv", parse_dates=["sale_date"])

def preprocess(df):
    df = df.copy()
    df["sale_date"] = pd.to_datetime(df["sale_date"])
    df = df.dropna(subset=["sold_price"])
    df["age"] = datetime.now().year - df.get("year_built", datetime.now().year)
    df["price_per_sqm"] = df["sold_price"] / df["floor_area_sqm"].replace({0: np.nan})
    df = pd.get_dummies(df, columns=["property_type"], dummy_na=True)
    df = df.fillna(0)
    return df

def split(df):
    cutoff = "2024-06-01"
    train = df[df["sale_date"] < pd.to_datetime(cutoff)]
    test = df[df["sale_date"] >= pd.to_datetime(cutoff)]
    return train, test

def train_eval(train, test):
    target = "sold_price"
    exclude = ["id", "sale_date", "neighborhood", "source"]
    features = [c for c in train.columns if c not in exclude and c != target]
    
    print(f"Training on {len(train)} samples with {len(features)} features")
    print(f"Features: {features}")
    
    # Use simple linear regression instead of LightGBM
    model = LinearRegression()
    model.fit(train[features], train[target])
    
    preds = model.predict(test[features])
    mae = mean_absolute_error(test[target], preds)
    rmse = np.sqrt(mean_squared_error(test[target], preds))
    mape = np.mean(np.abs((test[target] - preds) / np.maximum(test[target], 1))) * 100
    
    results = test.copy()
    results["predicted_price"] = preds
    
    return {"mae": mae, "rmse": rmse, "mape_pct": mape}, results

def save_results(metrics, preds_df):
    print("Metrics:", metrics)
    preds_df.to_csv("backtest_predictions.csv", index=False)
    pd.DataFrame([metrics]).to_csv("backtest_metrics.csv", index=False)
    print("Saved to CSV files")

def main():
    df = load_data()
    df = preprocess(df)
    train, test = split(df)
    metrics, preds = train_eval(train, test)
    save_results(metrics, preds)

if __name__ == "__main__":
    main()
