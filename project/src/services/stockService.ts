import api from './api';

export interface StockPredictionRequest {
    ticker: string;
    date: string;
}

export interface StockPredictionResponse {
    success: boolean;
    prediction?: {
        ticker: string;
        date: string;
        predictedPrice: number;   // Backend converts to camelCase
    };
    error?: string;
}

export const stockService = {
    predictStock: async (ticker: string, date: string): Promise<StockPredictionResponse> => {
        try {
            console.log(`[stockService] Predicting stock for ${ticker} on ${date}`);

            const response = await api.post('/stock/predict', { ticker, date });

            console.log('[stockService] API Response:', response.data);

            // Backend returns:
            // {
            //   success: true,
            //   prediction: {
            //     ticker: "AAPL",
            //     date: "2025-12-01",
            //     predictedPrice: 279.59
            //   }
            // }

            // Validate response structure
            if (!response.data) {
                console.error('[stockService] No data in response');
                return {
                    success: false,
                    error: 'Invalid response from server',
                };
            }

            if (response.data.success === false) {
                console.error('[stockService] Backend returned error:', response.data.error);
                return {
                    success: false,
                    error: response.data.error || 'Prediction failed',
                };
            }

            if (!response.data.prediction) {
                console.error('[stockService] No prediction in response');
                return {
                    success: false,
                    error: 'No prediction data received',
                };
            }

            console.log('[stockService] Prediction successful:', response.data.prediction);

            return {
                success: true,
                prediction: response.data.prediction
            };

        } catch (error: any) {
            console.error('[stockService] Error during prediction:', error);
            console.error('[stockService] Error response:', error.response?.data);

            return {
                success: false,
                error: error.response?.data?.error || error.message || 'Failed to predict stock price',
            };
        }
    },
};
