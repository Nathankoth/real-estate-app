# backtest.py
import os
import pandas as pd
import numpy as np
from datetime import datetime
import lightgbm as lgb
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sqlalchemy import create_engine

DB_URL = os.getenv("DB_URL")
CSV_FALLBACK = "sample_transactions.csv"
CUTOFF_DATE = os.getenv("CUTOFF_DATE", "2023-01-01")

def load_data():
    if DB_URL:
        engine = create_engine(DB_URL)
        df = pd.read_sql_table("transactions", engine)
    else:
        df = pd.read_csv(CSV_FALLBACK, parse_dates=["sale_date"])
    return df

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
    train = df[df["sale_date"] < pd.to_datetime(CUTOFF_DATE)]
    test = df[df["sale_date"] >= pd.to_datetime(CUTOFF_DATE)]
    return train, test

def train_eval(train, test):
    target = "sold_price"
    exclude = ["id", "sale_date", "neighborhood", "source"]
    features = [c for c in train.columns if c not in exclude and c != target]
    dtrain = lgb.Dataset(train[features], train[target])
    params = {"objective":"regression", "metric":"rmse", "verbosity":-1}
    model = lgb.train(params, dtrain, num_boost_round=200)
    preds = model.predict(test[features])
    mae = mean_absolute_error(test[target], preds)
    rmse = np.sqrt(mean_squared_error(test[target], preds))
    mape = np.mean(np.abs((test[target] - preds) / np.maximum(test[target], 1))) * 100
    results = test.copy()
    results["predicted_price"] = preds
    return {"mae":mae,"rmse":rmse,"mape_pct":mape}, results

def save_results(metrics, preds_df):
    print("Metrics:", metrics)
    if DB_URL:
        engine = create_engine(DB_URL)
        preds_df.to_sql("backtest_predictions", engine, if_exists="replace", index=False)
        metrics_df = pd.DataFrame([metrics])
        metrics_df.to_sql("backtest_metrics", engine, if_exists="append", index=False)
        print("Saved to Postgres")
    else:
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
