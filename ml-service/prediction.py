# ================================================================
# prediction.py (PATCHED for Windows SSL issue + Stable Stock Download)
# ================================================================

import os
import time
import re
import joblib
import requests
import feedparser
import yfinance as yf
import numpy as np
import pandas as pd
from textblob import TextBlob
from datetime import datetime, timedelta, date
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.losses import MeanSquaredError
import holidays
import ssl
import certifi

# Force Python to use certifi certificates (Windows Fix)
ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())

# Disable SSL verification ONLY for yfinance session
yf_session = requests.Session()
yf_session.verify = False

# ================================================================

NEWSAPI_KEY = "d6c7f2f2f9404197bed2dac0f467d05b"

CACHE_DIR = "cache"
MODEL_DIR = "model"
os.makedirs(CACHE_DIR, exist_ok=True)
os.makedirs(MODEL_DIR, exist_ok=True)

LOOK_BACK = 7
TRAIN_EPOCHS = 20
BATCH_SIZE = 16

us_holidays = holidays.US()

# ================================================================
# DATE FIXER
# ================================================================

def get_valid_trading_day(input_date):
    dt = datetime.strptime(input_date, "%Y-%m-%d").date()
    while dt.weekday() >= 5 or dt in us_holidays:
        dt += timedelta(days=1)
    return dt

# ================================================================
# STABLE STOCK DOWNLOADER (WITH SSL FIX & MULTIPLE FALLBACKS)
# ================================================================

def get_stock(ticker):
    print(f"Downloading stock data for {ticker}...")
    
    # 0. Setup
    end_date = datetime.now().strftime("%Y-%m-%d")
    start_date = "2020-01-01"
    
    # 1. Try standard download with SSL fix
    try:
        print(f"Attempt 1: yf.download for {ticker}")
        df = yf.download(
            ticker, 
            start=start_date, 
            end=end_date, 
            auto_adjust=True, 
            progress=False,
            session=yf_session
        )
        if not df.empty and len(df) > 10:
            print(f"✅ Success: Downloaded {len(df)} rows.")
            return df
    except Exception as e:
        print(f"⚠ Attempt 1 failed: {e}")

    # 2. Try Ticker.history
    try:
        print(f"Attempt 2: Ticker.history for {ticker}")
        tk = yf.Ticker(ticker)
        df = tk.history(start=start_date, end=end_date, auto_adjust=True)
        if not df.empty and len(df) > 10:
            print(f"✅ Success: Downloaded {len(df)} rows via history.")
            return df
    except Exception as e:
        print(f"⚠ Attempt 2 failed: {e}")

    # 3. Try without session (standard SSL)
    try:
        print(f"Attempt 3: Standard download (no custom session) for {ticker}")
        df = yf.download(ticker, start=start_date, end=end_date, progress=False)
        if not df.empty and len(df) > 10:
            print(f"✅ Success: Downloaded {len(df)} rows via standard.")
            return df
    except Exception as e:
        print(f"⚠ Attempt 3 failed: {e}")

    print(f"❌ ALL DOWNLOAD ATTEMPTS FAILED for {ticker}")
    return pd.DataFrame()

# ================================================================
# TRAIN MODEL
# ================================================================

def train_model(ticker):
    df = get_stock(ticker)
    if df.empty:
        return False

    df = df[["Close"]].copy()
    df["Sentiment"] = 0.0

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df)

    X, y = [], []
    for i in range(LOOK_BACK, len(scaled)):
        X.append(scaled[i-LOOK_BACK:i])
        y.append(scaled[i][0])

    X, y = np.array(X), np.array(y)

    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(LOOK_BACK, 2)),
        Dropout(0.2),
        LSTM(64),
        Dropout(0.2),
        Dense(32),
        Dense(1)
    ])

    model.compile(optimizer="adam", loss=MeanSquaredError())
    model.fit(X, y, epochs=TRAIN_EPOCHS, batch_size=BATCH_SIZE, verbose=1)

    model.save(f"{MODEL_DIR}/{ticker}_model.h5")
    joblib.dump(scaler, f"{MODEL_DIR}/{ticker}_scaler.pkl")

    return True

# ================================================================
# SAFE MODEL LOADER
# ================================================================

def load_safe(path):
    try:
        return load_model(path, custom_objects={"mse": MeanSquaredError()})
    except:
        return load_model(path, custom_objects={"MeanSquaredError": MeanSquaredError()})

# ================================================================
# PREDICT FUNCTION
# ================================================================

def predict_stock_price(ticker, date_str):
    ticker = ticker.upper()

    model_path = f"{MODEL_DIR}/{ticker}_model.h5"
    scaler_path = f"{MODEL_DIR}/{ticker}_scaler.pkl"

    # Train model if not exists
    if not os.path.exists(model_path):
        ok = train_model(ticker)
        if not ok:
            return {"error": "Unable to train model (stock download failed)."}

    model = load_safe(model_path)
    scaler = joblib.load(scaler_path)

    df = get_stock(ticker)
    if df.empty:
        return {"error": "No stock data"}

    df = df[["Close"]].copy()
    df["Sentiment"] = 0.0

    scaled = scaler.transform(df)
    seq = scaled[-LOOK_BACK:].reshape(1, LOOK_BACK, 2)

    pred_scaled = model.predict(seq)
    pad = np.zeros((1, 1))
    predicted_price = scaler.inverse_transform(np.hstack([pred_scaled, pad]))[0][0]

    market_date = get_valid_trading_day(date_str)

    return {
        "ticker": ticker,
        "requested_date": date_str,
        "market_date": str(market_date),
        "predicted_price": round(float(predicted_price), 2)
    }
