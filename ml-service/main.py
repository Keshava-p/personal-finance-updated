# main.py
from fastapi import FastAPI
from pydantic import BaseModel
from prediction import predict_stock_price
import uvicorn

app = FastAPI(title="Stock Prediction ML Service")

class StockRequest(BaseModel):
    ticker: str
    date: str

@app.post("/predict")
def predict(req: StockRequest):
    result = predict_stock_price(req.ticker, req.date)
    return result

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=5001, reload=True)
