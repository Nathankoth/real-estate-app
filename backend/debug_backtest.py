import pandas as pd
import os

# Load data
df = pd.read_csv("sample_transactions.csv", parse_dates=["sale_date"])
print("Total records:", len(df))
print("Date range:", df["sale_date"].min(), "to", df["sale_date"].max())

# Test different cutoff dates
cutoff_dates = ["2024-01-01", "2024-02-01", "2024-06-01", "2024-08-01"]
for cutoff in cutoff_dates:
    train = df[df["sale_date"] < pd.to_datetime(cutoff)]
    test = df[df["sale_date"] >= pd.to_datetime(cutoff)]
    print(f"Cutoff {cutoff}: Train={len(train)}, Test={len(test)}")
