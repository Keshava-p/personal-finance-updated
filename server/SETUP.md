# Backend Server Setup Guide

## ✅ Server Status

The server is now running on `http://localhost:5000`

## 📋 MongoDB Setup (Required for Full Functionality)

The server needs MongoDB to store user data, expenses, goals, and debts. You have two options:

### Option 1: Local MongoDB (Recommended for Development)

1. **Download MongoDB Community Server:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download and install for Windows

2. **Start MongoDB Service:**
   ```bash
   # MongoDB usually starts automatically as a Windows service
   # If not, start it manually:
   net start MongoDB
   ```

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   # or
   mongo
   ```

### Option 2: MongoDB Atlas (Cloud - No Installation Required)

1. **Create Free Account:**
   - Visit: https://www.mongodb.com/cloud/atlas
   - Sign up for free tier

2. **Create a Cluster:**
   - Create a free M0 cluster
   - Get your connection string

3. **Update `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pfm_app
   ```

4. **Restart the server:**
   ```bash
   npm start
   ```

## 🔧 Current Configuration

The `.env` file is configured with:
- **MongoDB URI**: `mongodb://localhost:27017/pfm_app` (local)
- **Port**: `5000`
- **CORS**: `http://localhost:5173` (Vite default)

## 🧪 Test the Server

1. **Health Check:**
   ```bash
   curl http://localhost:5000/health
   ```

2. **Test Salary Update:**
   - Open the frontend app
   - Go to Profile page
   - Update salary
   - Check browser console for logs

## 🐛 Troubleshooting

### Server won't start:
- Check if port 5000 is already in use
- Verify Node.js is installed: `node --version`
- Check dependencies: `npm install`

### Database connection fails:
- Verify MongoDB is running (local) or connection string is correct (Atlas)
- Check `.env` file has correct `MONGODB_URI`
- For Atlas: Ensure IP whitelist includes your IP (0.0.0.0/0 for development)

### Salary not saving:
- Check browser console for error messages
- Verify server is running: `curl http://localhost:5000/health`
- Check MongoDB connection in server logs

## 📝 Next Steps

1. **Start MongoDB** (if using local)
2. **Restart the server** if you updated `.env`
3. **Test the salary update** in the frontend
4. **Check server logs** for any errors

