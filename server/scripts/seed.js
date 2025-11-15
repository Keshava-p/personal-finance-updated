import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Goal from '../models/Goal.js';
import Debt from '../models/Debt.js';
import Transaction from '../models/Transaction.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Goal.deleteMany({});
    await Debt.deleteMany({});
    await Transaction.deleteMany({});

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      phone: '+91 98765 43210',
      dob: new Date('1990-01-15'),
      monthlySalary: 50000,
      incomeType: 'salary',
      taxRegime: 'new',
      currencyPreference: 'INR',
      languagePreference: 'en',
      themePreference: 'system',
      emergencyFundTarget: 300000,
      pan: 'ABCDE1234F',
      bankDetails: 'HDFC Bank - Account ending 1234',
    });

    console.log('Created user:', user.email);

    // Create sample goals
    const goals = await Goal.create([
      {
        userId: user._id,
        name: 'Emergency Fund',
        targetAmount: 300000,
        currentSaved: 150000,
        deadline: new Date('2024-12-31'),
        category: 'emergency',
        currency: 'INR',
      },
      {
        userId: user._id,
        name: 'Vacation Fund',
        targetAmount: 100000,
        currentSaved: 25000,
        deadline: new Date('2024-06-30'),
        category: 'travel',
        currency: 'INR',
      },
    ]);

    console.log(`Created ${goals.length} goals`);

    // Create sample debts
    const debts = await Debt.create([
      {
        userId: user._id,
        name: 'Home Loan',
        principal: 2000000,
        monthlyPayment: 25000,
        apr: 8.5,
        startDate: new Date('2023-01-01'),
        currency: 'INR',
      },
      {
        userId: user._id,
        name: 'Credit Card',
        principal: 50000,
        monthlyPayment: 5000,
        apr: 18,
        startDate: new Date('2023-06-01'),
        currency: 'INR',
      },
    ]);

    console.log(`Created ${debts.length} debts`);

    // Create sample transactions
    const transactions = await Transaction.create([
      {
        userId: user._id,
        amount: 2000,
        category: 'food',
        description: 'Grocery shopping',
        date: new Date(),
        currency: 'INR',
      },
      {
        userId: user._id,
        amount: 500,
        category: 'transport',
        description: 'Uber ride',
        date: new Date(),
        currency: 'INR',
      },
      {
        userId: user._id,
        amount: 1500,
        category: 'entertainment',
        description: 'Movie tickets',
        date: new Date(),
        currency: 'INR',
      },
    ]);

    console.log(`Created ${transactions.length} transactions`);

    console.log('\n✅ Database seeded successfully!');
    console.log(`\nTest user ID: ${user._id}`);
    console.log('Email: test@example.com');
    console.log('\nYou can use this user ID in API requests with header: x-user-id');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedDatabase();

