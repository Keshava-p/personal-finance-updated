# Personal Finance Management System

A full-stack personal finance management application with AI-powered insights, multi-currency support, multi-language support, debt management, and voice assistant capabilities.

## 🚀 Features

- **User Profile Management**: Complete profile with salary, income type, tax regime, currency, and language preferences
- **Multi-Currency Support**: INR, USD, EUR, GBP, AED with real-time conversion
- **Multi-Language Support**: English, Hindi, Kannada, Tamil, Telugu, Malayalam, Marathi, Bengali, Gujarati
- **Expense Tracking**: Add, edit, delete expenses with categories
- **Goal Management**: Set savings goals with progress tracking
- **Debt Manager**: Track debts with DTI calculations and automated recommendations
- **AI Insights**: Get personalized financial insights powered by OpenAI
- **Voice Assistant**: Voice commands for expense entry and navigation
- **Budget Planning**: Auto-calculated budgets based on salary
- **Reports & Analytics**: Visual charts and detailed reports

## 📁 Project Structure

```
.
├── project/          # Frontend (React + Vite + TypeScript)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── i18n/
│   └── package.json
├── server/           # Backend (Node.js + Express + MongoDB)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   └── server.js
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MongoDB (local or MongoDB Atlas)
- OpenAI API key (for AI insights)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
MONGODB_URI=mongodb://localhost:27017/pfm
PORT=5000
AI_PROVIDER=openai
AI_API_KEY=your-openai-api-key-here
CORS_ORIGINS=http://localhost:5173
```

5. Seed the database (optional):
```bash
npm run seed
```

6. Start the server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to project directory:
```bash
cd project
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (optional, for custom API URL):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📝 API Endpoints

### Profile

- `GET /api/profile` - Get user profile
- `POST /api/profile/update` - Update profile
- `POST /api/profile/salary` - Update salary
- `POST /api/profile/preferences` - Update currency/language preferences

### Goals

- `GET /api/goals` - Get all goals
- `POST /api/goals` - Create goal
- `PUT /api/goals/:id` - Update goal
- `DELETE /api/goals/:id` - Delete goal

### Debts

- `GET /api/debts` - Get all debts with DTI calculations
- `POST /api/debts` - Create debt
- `PUT /api/debts/:id` - Update debt
- `DELETE /api/debts/:id` - Delete debt

### AI Insights

- `POST /api/ai/insights` - Get AI-powered financial insights

### Currency

- `GET /api/currency/convert?from=INR&to=USD&amount=1000` - Convert currency

## 🔧 Example API Calls

### Update Salary

```bash
curl -X POST http://localhost:5000/api/profile/salary \
  -H "Content-Type: application/json" \
  -H "x-user-id: test@example.com" \
  -d '{"monthlySalary": 60000}'
```

### Create Goal

```bash
curl -X POST http://localhost:5000/api/goals \
  -H "Content-Type: application/json" \
  -H "x-user-id: test@example.com" \
  -d '{
    "name": "Emergency Fund",
    "targetAmount": 300000,
    "currentSaved": 150000,
    "deadline": "2024-12-31",
    "category": "emergency",
    "currency": "INR"
  }'
```

### Add Debt

```bash
curl -X POST http://localhost:5000/api/debts \
  -H "Content-Type: application/json" \
  -H "x-user-id: test@example.com" \
  -d '{
    "name": "Home Loan",
    "principal": 2000000,
    "monthlyPayment": 25000,
    "apr": 8.5,
    "currency": "INR"
  }'
```

### Get AI Insights

```bash
curl -X POST http://localhost:5000/api/ai/insights \
  -H "Content-Type: application/json" \
  -H "x-user-id: test@example.com" \
  -d '{
    "userId": "test@example.com",
    "context": {}
  }'
```

### Convert Currency

```bash
curl "http://localhost:5000/api/currency/convert?from=INR&to=USD&amount=1000"
```

## 🎨 UI Features

- **Modern Design**: Clean, responsive interface with dark mode support
- **Currency Background**: Animated currency pattern background (add `public/currency-pattern.png`)
- **Neon Accents**: Eye-catching neon buttons and highlights
- **Animated Progress Bars**: Smooth progress indicators for goals
- **Micro-animations**: Subtle animations for better UX

## 🗣️ Voice Assistant Commands

The voice assistant supports the following commands:

- "show insights" - Display AI insights
- "add expense [amount] for [category]" - Add expense
- "add debt [name] [amount] monthly [payment]" - Add debt
- "show goals" - Display goals
- "set salary [amount]" - Update salary
- "change currency to [currency]" - Change currency
- "change language to [language]" - Change language

## 📊 Debt-to-Income (DTI) Recommendations

The system automatically calculates DTI and provides recommendations:

- **DTI ≤ 20%**: Healthy - Maintain good financial habits
- **20% < DTI ≤ 35%**: Moderate - Focus on budgeting and emergency fund
- **35% < DTI ≤ 50%**: Caution - Consider debt consolidation/refinancing
- **DTI > 50%**: Urgent - Immediate action required, seek professional help

## 🔐 Authentication

Currently uses a simple stub authentication. For production:

1. Implement JWT-based authentication
2. Add password hashing with bcrypt
3. Implement session management
4. Add rate limiting

## 📦 Environment Variables

### Backend (.env)

- `MONGODB_URI` - MongoDB connection string (required)
- `PORT` - Server port (default: 5000)
- `AI_PROVIDER` - AI provider (default: openai)
- `AI_API_KEY` - OpenAI API key (required for AI insights)
- `EXCHANGE_API_URL` - Exchange rate API URL (optional)
- `CORS_ORIGINS` - Allowed CORS origins

### Frontend (.env)

- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## ✅ TODO for Owner

Before running the application, please complete the following:

- [ ] **MongoDB Setup**: 
  - Install MongoDB locally OR
  - Create MongoDB Atlas account and get connection string
  - Update `MONGODB_URI` in `server/.env`

- [ ] **OpenAI API Key**:
  - Sign up at https://platform.openai.com/
  - Generate API key
  - Add to `server/.env` as `AI_API_KEY`

- [ ] **Currency Pattern Asset** (Optional):
  - Create or download a currency pattern image
  - Save as `project/public/currency-pattern.png`
  - The CSS will automatically use it as background

- [ ] **Test User**:
  - Run `npm run seed` in server directory to create test user
  - Default email: `test@example.com`

## 🧪 Testing

### Test Profile Flow

1. Start backend and frontend
2. Navigate to Profile page
3. Enter salary: 50000 INR
4. Select currency: INR
5. Select language: Hindi
6. Verify UI switches to Hindi and shows ₹ symbol

### Test Salary Editing

1. Go to Settings or Profile
2. Edit salary to 60000
3. Verify dashboard updates with new calculations

### Test Currency Conversion

1. Change currency preference to USD
2. Verify all amounts convert and display with $ symbol

### Test Goals

1. Create goal: target=100000, currentSaved=25000
2. Verify progress shows 25% with animated bar

### Test Debt Manager

1. Add debt: principal=200000, monthlyPayment=5000, APR=10%
2. Verify DTI calculation and recommendations appear
3. Check payoff projection

### Test AI Insights

1. Ensure `AI_API_KEY` is set in backend `.env`
2. Click "Get Insights" in Dashboard
3. Verify insights panel shows summary and action items

### Test Voice Assistant

1. Click microphone button
2. Say "set salary to 80,000 rupees"
3. Verify confirmation dialog appears
4. Confirm to update salary

## 🐛 Troubleshooting

### Backend won't start

- Check MongoDB is running
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use

### Frontend can't connect to backend

- Verify backend is running on port 5000
- Check `VITE_API_URL` in frontend `.env`
- Verify CORS settings in backend

### AI Insights not working

- Verify `AI_API_KEY` is set correctly
- Check OpenAI account has credits
- Review backend logs for error messages

### Currency conversion fails

- Check internet connection (uses external API)
- Verify currency codes are correct (INR, USD, EUR, GBP, AED)
- Check backend logs for API errors

## 📄 License

MIT

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions, please open an issue on the repository.

---

**Note**: This is a development version. For production deployment, ensure proper security measures, authentication, and error handling are implemented.

