import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';

// Routes
import profileRoutes from './routes/profileRoutes.js';
import goalRoutes from './routes/goalRoutes.js';
import debtRoutes from './routes/debtRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import currencyRoutes from './routes/currencyRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:5173'],
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/profile', profileRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/currency', currencyRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
  try {
    const dbConnected = await connectDB();
    if (!dbConnected) {
      console.log('⚠️  Starting server without database connection...');
    }
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      if (!dbConnected) {
        console.log('⚠️  Note: Database not connected. Some features may not work.');
      }
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

