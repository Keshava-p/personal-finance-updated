import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    TrendingUp,
    Calendar,
    DollarSign,
    AlertCircle,
    Loader2,
    CheckCircle,
    XCircle,
    Info,
    BarChart3
} from 'lucide-react';
import { GlassCard, GlassCardGradient } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';
import { PremiumInput } from '../components/ui/PremiumInput';
import { SkeletonLoader } from '../components/ui/SkeletonLoader';
import { stockService } from '../services/stockService';

// Popular stock tickers
const POPULAR_STOCKS = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.' },
    { symbol: 'MSFT', name: 'Microsoft' },
    { symbol: 'TSLA', name: 'Tesla Inc.' },
    { symbol: 'AMZN', name: 'Amazon' },
    { symbol: 'META', name: 'Meta Platforms' },
];

export function StockPrediction() {
    const { t } = useTranslation();
    const [ticker, setTicker] = useState('');
    const [date, setDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    // Market status
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const isWeekend = day === 0 || day === 6;
    const isMarketOpen = !isWeekend && hour >= 9 && hour < 16;

    const handlePredict = async () => {
        try {
            console.log('[StockPrediction] Starting prediction...');

            if (!ticker || !date) {
                setError('Please enter both ticker and date');
                return;
            }

            setLoading(true);
            setError(null);
            setPrediction(null);

            console.log(`[StockPrediction] Calling stockService for ${ticker} on ${date}`);

            const result = await stockService.predictStock(ticker.toUpperCase(), date);

            console.log('[StockPrediction] Result received:', result);

            setLoading(false);

            // Safely check if prediction was successful
            if (result && result.success === true && result.prediction) {
                console.log('[StockPrediction] Prediction successful:', result.prediction.predictedPrice);

                // Safely access predictedPrice with fallback
                const predictedPrice = result.prediction.predictedPrice;

                if (typeof predictedPrice === 'number' && !isNaN(predictedPrice)) {
                    setPrediction(predictedPrice);
                } else {
                    console.error('[StockPrediction] Invalid predicted price:', predictedPrice);
                    setError('Received invalid prediction data');
                }
            } else {
                console.log('[StockPrediction] Prediction failed:', result?.error);
                setError(result?.error || 'Failed to get prediction');
            }
        } catch (error: any) {
            console.error('[StockPrediction] Unexpected error in handlePredict:', error);
            setLoading(false);
            setError(`An unexpected error occurred: ${error.message || 'Unknown error'}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handlePredict();
        }
    };

    const handleTickerClick = (symbol: string) => {
        setTicker(symbol);
        setPrediction(null);
        setError(null);
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start justify-between flex-wrap gap-4"
            >
                <div className="flex items-center gap-4">
                    <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-400/30">
                        <TrendingUp className="h-10 w-10 text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-white dark:text-white light:text-slate-900 mb-2">Stock Prediction</h1>
                        <p className="text-white/60 dark:text-white/60 light:text-slate-600 text-lg">Predict future stock prices using AI</p>
                    </div>
                </div>

                {/* Market Status */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`flex items-center justify-center gap-3 px-4 py-3 rounded-2xl border-2 backdrop-blur-sm ${isMarketOpen
                        ? 'bg-emerald-500/10 border-emerald-400/30'
                        : 'bg-red-500/10 border-red-400/30'
                        }`}
                >
                    <motion.div
                        animate={isMarketOpen ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className={`w-3 h-3 rounded-full ${isMarketOpen ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' : 'bg-red-400'
                            }`}
                    />
                    <span className={`text-sm font-semibold ${isMarketOpen ? 'text-emerald-300' : 'text-red-300'
                        }`}>
                        {isMarketOpen
                            ? 'Market is Open'
                            : isWeekend
                                ? 'Market Closed (Weekend)'
                                : 'Market is Closed'}
                    </span>
                    {isMarketOpen && (
                        <span className="px-2 py-0.5 text-xs font-bold bg-emerald-400/20 text-emerald-300 rounded-full">
                            LIVE
                        </span>
                    )}
                </motion.div>
            </motion.div>

            {/* Popular Stocks */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <h3 className="text-lg font-semibold text-white dark:text-white light:text-slate-900 mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-cyan-400" />
                    Popular Stocks
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {POPULAR_STOCKS.map((stock, index) => (
                        <motion.button
                            key={stock.symbol}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 + index * 0.05 }}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTickerClick(stock.symbol)}
                            className={`p-4 rounded-xl backdrop-blur-sm transition-all ${ticker === stock.symbol
                                ? 'bg-cyan-500/20 border-2 border-cyan-400 shadow-lg shadow-cyan-500/20'
                                : 'bg-white/5 dark:bg-white/5 light:bg-white/80 border-2 border-white/10 dark:border-white/10 light:border-slate-200 hover:bg-white/10 dark:hover:bg-white/10 light:hover:bg-white hover:border-cyan-400/50'
                                }`}
                        >
                            <div className={`font-bold text-lg ${ticker === stock.symbol ? 'text-cyan-300' : 'text-white dark:text-white light:text-slate-900'
                                }`}>
                                {stock.symbol}
                            </div>
                            <div className={`text-xs truncate mt-1 ${ticker === stock.symbol ? 'text-cyan-200/80' : 'text-white/60 dark:text-white/60 light:text-slate-600'
                                }`}>
                                {stock.name}
                            </div>
                        </motion.button>
                    ))}
                </div>
            </motion.div>

            {/* Main Prediction Card */}
            <GlassCard className="p-8">
                <div className="max-w-3xl mx-auto space-y-6">
                    {/* Input Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <PremiumInput
                            label="Stock Ticker"
                            placeholder="e.g., AAPL, TSLA, GOOGL"
                            value={ticker}
                            onChange={(e) => setTicker(e.target.value.toUpperCase())}
                            onKeyPress={handleKeyPress}
                            leftIcon={<TrendingUp className="h-5 w-5" />}
                            maxLength={5}
                        />

                        <PremiumInput
                            label="Prediction Date"
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            onKeyPress={handleKeyPress}
                            leftIcon={<Calendar className="h-5 w-5" />}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Predict Button */}
                    <NeonButton
                        onClick={handlePredict}
                        disabled={loading || !ticker || !date}
                        variant="primary"
                        size="lg"
                        className="w-full"
                        loading={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Analyzing Market Data...
                            </>
                        ) : (
                            <>
                                <TrendingUp className="h-5 w-5" />
                                Predict Stock Price
                            </>
                        )}
                    </NeonButton>

                    {/* Loading Skeleton */}
                    <AnimatePresence>
                        {loading && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <SkeletonLoader variant="card" height="200px" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Prediction Result */}
                    <AnimatePresence>
                        {prediction !== null && !loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <GlassCardGradient gradient="from-emerald-500/20 via-green-500/20 to-emerald-500/20">
                                    <div className="text-center space-y-6">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                            className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50"
                                        >
                                            <CheckCircle className="h-8 w-8 text-emerald-400" />
                                        </motion.div>

                                        <div>
                                            <p className="text-sm text-white/60 mb-1">Predicted Price for</p>
                                            <h3 className="text-2xl font-bold text-white mb-1">{ticker.toUpperCase()}</h3>
                                            <p className="text-xs text-white/40">on {new Date(date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</p>
                                        </div>

                                        <motion.div
                                            initial={{ scale: 0.8, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
                                            className="py-6"
                                        >
                                            <div className="flex items-center justify-center gap-3">
                                                <DollarSign className="h-12 w-12 text-emerald-400" />
                                                <span className="text-7xl font-bold text-white tracking-tight">
                                                    {prediction.toFixed(2)}
                                                </span>
                                            </div>
                                            <p className="text-sm text-white/50 mt-2">USD per share</p>
                                        </motion.div>

                                        <div className="flex items-center justify-center gap-2 text-sm text-emerald-300">
                                            <BarChart3 className="h-4 w-4" />
                                            <span>AI-powered prediction</span>
                                        </div>
                                    </div>
                                </GlassCardGradient>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Error Display */}
                    <AnimatePresence>
                        {error && !loading && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="p-6 rounded-xl bg-red-500/20 border border-red-400/30 flex items-start gap-4"
                            >
                                <XCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-base font-semibold text-red-300 mb-1">Prediction Failed</p>
                                    <p className="text-sm text-white/70">{error}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </GlassCard>

            {/* How it Works Section */}
            <GlassCard>
                <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="w-full flex items-center justify-between p-2 hover:bg-white/5 dark:hover:bg-white/5 light:hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/20">
                            <Info className="h-5 w-5 text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-white dark:text-white light:text-slate-900">How it works</h3>
                    </div>
                    <motion.div
                        animate={{ rotate: showExplanation ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <TrendingUp className="h-5 w-5 text-white/40 dark:text-white/40 light:text-slate-400" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {showExplanation && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-4 pt-4 border-t border-white/10 dark:border-white/10 light:border-slate-200"
                        >
                            <div className="space-y-4 text-white/70 dark:text-white/70 light:text-slate-600">
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-cyan-400">1</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white/90 dark:text-white/90 light:text-slate-900 mb-1">Enter Stock Information</p>
                                        <p className="text-sm">Select a ticker symbol or enter one manually, then choose a future date for prediction.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-violet-400">2</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white/90 dark:text-white/90 light:text-slate-900 mb-1">AI Analysis</p>
                                        <p className="text-sm">Our LSTM neural network analyzes historical price data and market sentiment to generate predictions.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                        <span className="text-xs font-bold text-emerald-400">3</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-white/90 dark:text-white/90 light:text-slate-900 mb-1">Get Prediction</p>
                                        <p className="text-sm">Receive an AI-powered price prediction for your selected date.</p>
                                    </div>
                                </div>
                                <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-400/30">
                                    <p className="text-sm text-amber-200 dark:text-amber-200 light:text-amber-800 flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                                        <span><strong>Disclaimer:</strong> Predictions are estimates based on historical data and should not be used as financial advice. Always do your own research before making investment decisions.</span>
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </GlassCard>
        </div>
    );
}
