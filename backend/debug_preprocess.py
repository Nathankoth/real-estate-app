import pandas as pd
import numpy as np
from datetime import datetime

# Load and preprocess data like in backtest.py
df = pd.read_csv("sample_transactions.csv", parse_dates=["sale_date"])
print("Original data shape:", df.shape)
print("Original columns:", df.columns.tolist())

# Preprocess
df = df.copy()
df["sale_date"] = pd.to_datetime(df["sale_date"])
df = df.dropna(subset=["sold_price"])
print("After dropna:", df.shape)

df["age"] = datetime.now().year - df.get("year_built", datetime.now().year)
print("After age calculation:", df.shape)

df["price_per_sqm"] = df["sold_price"] / df["floor_area_sqm"].replace({0: np.nan})
print("After price_per_sqm:", df.shape)

df = pd.get_dummies(df, columns=["property_type"], dummy_na=True)
print("After get_dummies:", df.shape)

df = df.fillna(0)
print("Final shape:", df.shape)
print("Final columns:", df.columns.tolist())

# Test split
cutoff = "2024-06-01"
train = df[df["sale_date"] < pd.to_datetime(cutoff)]
test = df[df["sale_date"] >= pd.to_datetime(cutoff)]
print(f"Train shape: {train.shape}, Test shape: {test.shape}")

# Check features
target = "sold_price"
exclude = ["id", "sale_date", "neighborhood"]
features = [c for c in train.columns if c not in exclude and c != target]
print(f"Features ({len(features)}): {features}")

# Check if we have any features left
if len(features) == 0:
    print("ERROR: No features left after preprocessing!")
else:
    print(f"Feature matrix shape: {train[features].shape}")
    print(f"Target shape: {train[target].shape}")
