import axios from "axios";

export const predictStock = async (req, res) => {
    try {
        const { ticker, date } = req.body;

        // -------------------------------
        // Basic Validation
        // -------------------------------
        if (!ticker || !date) {
            return res.status(400).json({
                success: false,
                error: "Please provide both ticker and date",
            });
        }

        if (!/^[A-Z]{1,5}$/.test(ticker.toUpperCase())) {
            return res.status(400).json({
                success: false,
                error: "Invalid ticker format (AAPL, TSLA, MSFT...)",
            });
        }

        const predictionDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (predictionDate < today) {
            return res.status(400).json({
                success: false,
                error: "Prediction date must be today or future",
            });
        }

        // -------------------------------
        // Call ML Microservice
        // -------------------------------
        console.log(`➡️  Calling ML service for ${ticker} on ${date}`);

        const ML_URL = "http://localhost:5001/predict";
        const response = await axios.post(
            ML_URL,
            { ticker: ticker.toUpperCase(), date },
            { timeout: 60000 }
        );

        const ml = response.data;
        console.log("⬅️  ML Response:", ml);

        // -------------------------------
        // Handle ML Errors
        // -------------------------------
        if (ml.error) {
            return res.status(400).json({
                success: false,
                error: ml.error,
            });
        }

        // -------------------------------
        // Normalize predicted price
        // ML sometimes returns:
        // predicted_price OR predictedPrice OR inside prediction{}
        // -------------------------------
        const finalPrice =
            ml.predicted_price ??
            ml.predictedPrice ??
            ml.prediction?.predicted_price ??
            ml.prediction?.predictedPrice ??
            null;

        if (finalPrice === null) {
            return res.status(500).json({
                success: false,
                error: "ML service returned no predicted price",
            });
        }

        const priceNum = Number(finalPrice);
        if (isNaN(priceNum)) {
            return res.status(500).json({
                success: false,
                error: "ML returned invalid price format",
            });
        }

        // -------------------------------
        // Final API Response (UI expects this)
        // -------------------------------
        return res.json({
            success: true,
            prediction: {
                ticker: ml.ticker || ticker.toUpperCase(),
                date: ml.market_date || ml.requested_date || date,
                predictedPrice: priceNum,
                sentiment: {
                    news: ml.news_sentiment ?? 0,
                    yahoo: ml.yahoo_sentiment ?? 0,
                    combined: ml.combined_sentiment ?? 0,
                },
                keywords: ml.keywords ?? [],
            },
        });

    } catch (error) {
        console.error("❌ Prediction Error:", error.message);
        console.error("⚠️ Details:", error.response?.data);

        // ML server not running
        if (error.code === "ECONNREFUSED") {
            return res.status(503).json({
                success: false,
                error: "ML service offline (Start it on port 5001)",
            });
        }

        // Timeout
        if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
            return res.status(504).json({
                success: false,
                error:
                    "ML service timeout — the model may be training for the first time",
            });
        }

        // ML sent a structured error
        if (error.response) {
            return res.status(error.response.status).json({
                success: false,
                error:
                    error.response.data.error ||
                    error.response.data.detail ||
                    "ML service error",
            });
        }

        // Unknown error
        return res.status(500).json({
            success: false,
            error: "Unexpected backend error during stock prediction",
        });
    }
};
