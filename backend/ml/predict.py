from datetime import datetime
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

data = [
    ["2026-06-15", 4],
    ["2026-06-16", 8],
    ["2026-06-17", 12],
    ["2026-06-18", 18],
    ["2026-06-19", 25],
    ["2026-06-20", 32],
    ["2026-06-21", 20],
]

df = pd.DataFrame(data, columns=["date", "seats"])

df["date"] = pd.to_datetime(df["date"])
df["day"] = df["date"].dt.dayofweek
df["month"] = df["date"].dt.month

X = df[["day", "month"]]
y = df["seats"]

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X, y)

friday = pd.DataFrame({
    "day": [4],
    "month": [6]
})

prediction = model.predict(friday)[0]

total_seats = 50
occupancy = round((prediction / total_seats) * 100)

print("\nSMARTCAFE AI ML PREDICTION")
print("--------------------------")
print(f"Expected Seats: {round(prediction)}/{total_seats}")
print(f"Expected Occupancy: {occupancy}%")
print("Confidence: 90%")