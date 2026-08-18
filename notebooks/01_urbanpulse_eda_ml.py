"""
UrbanPulse AI - Exploratory Data Analysis & Model Evaluation Notebook Script
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor, RandomForestClassifier
from sklearn.metrics import r2_score, mean_squared_error, accuracy_score, f1_score

def run_analysis():
    print("[UrbanPulse EDA] Loading synthetic development dataset...")
    df = pd.read_csv("data/urbanpulse_dataset.csv")
    print(f"Dataset shape: {df.shape}")
    print("\nSummary Statistics:")
    print(df[['traffic_density', 'congestion_index', 'avg_speed_kmh', 'aqi', 'pm25', 'risk_score']].describe())

    print("\nTraining AQI Random Forest Model...")
    features = ['traffic_density', 'temperature_c', 'humidity_pct', 'pm25', 'pm10', 'co2_ppm']
    X = df[features]
    y = df['aqi']
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    preds = model.predict(X)
    print(f"AQI Model R² Score: {r2_score(y, preds):.4f}")
    print(f"AQI Model RMSE: {np.sqrt(mean_squared_error(y, preds)):.4f}")

if __name__ == "__main__":
    run_analysis()
