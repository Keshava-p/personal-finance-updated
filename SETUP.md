# Quick Setup Guide

## Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   Create a file named `.env` in the `server/` directory with:
   ```env
   MONGODB_URI=mongodb://localhost:27017/pfm
   PORT=5000
   AI_PROVIDER=openai
   AI_API_KEY=your-openai-api-key-here
   CORS_ORIGINS=http://localhost:5173
   ```

4. **Seed database (optional):**
   ```bash
   npm run seed
   ```

5. **Start server:**
   ```bash
   npm start
   ```

## Frontend Setup

1. **Navigate to project directory:**
   ```bash
   cd project
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

## Required API Keys

### OpenAI API Key (for AI Insights)

1. Sign up at https://platform.openai.com/
2. Go to API Keys section
3. Create a new API key
4. Add to `server/.env` as `AI_API_KEY`

## Optional: Currency Pattern Image

1. Create or download a currency pattern image
2. Save as `project/public/currency-pattern.png`
3. The CSS will automatically use it as background

## Testing

1. Open http://localhost:5173
2. Navigate to Profile page
3. Complete your profile
4. Test features:
   - Add expenses
   - Create goals
   - Add debts
   - Get AI insights
   - Use voice assistant

## Troubleshooting

- **Backend won't start**: Check MongoDB is running and `.env` file exists
- **Frontend can't connect**: Verify backend is running on port 5000
- **AI insights fail**: Check `AI_API_KEY` is set correctly in backend `.env`

