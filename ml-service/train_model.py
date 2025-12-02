import yfinance as yf
import numpy as np
import pandas as pd
import joblib
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout

START_DATE = "2020-01-01"

def train_model():
    print("Downloading stock data...")
    df = yf.download("AAPL", start=START_DATE)

    if df.empty:
        print("Error: Could not download stock data.")
        return

    df = df[["Close"]]
    df["Sentiment"] = 0  

    scaler = MinMaxScaler()
    scaled = scaler.fit_transform(df)

    look_back = 7
    X, y = [], []

    for i in range(look_back, len(scaled)):
        X.append(scaled[i-look_back:i])
        y.append(scaled[i, 0])

    X, y = np.array(X), np.array(y)

    print("Training LSTM model...")
    model = Sequential([
        LSTM(64, return_sequences=True, input_shape=(look_back, 2)),
        Dropout(0.2),
        LSTM(64),
        Dropout(0.2),
        Dense(32),
        Dense(1)
    ])

    model.compile(optimizer="adam", loss="mean_squared_error")
    model.fit(X, y, epochs=60, batch_size=16, verbose=1)

    print("Saving model...")
    model.save("model/stock_predictor.h5")
    joblib.dump(scaler, "model/scaler.pkl")

    print("MODEL TRAINED AND SAVED SUCCESSFULLY!")

if __name__ == "__main__":
    train_model()
