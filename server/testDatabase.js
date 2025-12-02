// Test script to verify database storage
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const testDatabaseStorage = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/personal_finance');
        console.log('✅ Connected to MongoDB');

        // Find all users
        const users = await User.find({}).select('-password');
        console.log(`\n📊 Total users in database: ${users.length}\n`);

        if (users.length > 0) {
            console.log('👥 Users found:');
            users.forEach((user, index) => {
                console.log(`\n${index + 1}. User Details:`);
                console.log(`   - ID: ${user._id}`);
                console.log(`   - Name: ${user.name}`);
                console.log(`   - Email: ${user.email}`);
                console.log(`   - Monthly Salary: ${user.monthlySalary || 'Not set'}`);
                console.log(`   - Currency: ${user.currencyPreference || 'Not set'}`);
                console.log(`   - Language: ${user.languagePreference || 'Not set'}`);
                console.log(`   - Created: ${user.createdAt}`);
            });
        } else {
            console.log('⚠️  No users found in database');
        }

        // Find the test user we just created
        const testUser = await User.findOne({ email: 'testdb@example.com' });
        if (testUser) {
            console.log('\n✅ Test user "testdb@example.com" found in database!');
            console.log('   Database storage is working correctly.');
        } else {
            console.log('\n❌ Test user "testdb@example.com" NOT found in database!');
            console.log('   There may be an issue with database storage.');
        }

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

testDatabaseStorage();
