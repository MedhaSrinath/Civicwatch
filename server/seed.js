const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Department = require('./models/Department');
const Category = require('./models/Category');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();
    console.log('Seeding database...');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Category.deleteMany({});

    // Create departments
    const departments = await Department.insertMany([
      { name: 'Roads & Infrastructure', description: 'Handles road repairs, potholes, and infrastructure maintenance' },
      { name: 'Water Supply', description: 'Manages water supply issues and pipe leakage' },
      { name: 'Sanitation', description: 'Handles garbage collection and sanitation issues' },
      { name: 'Electricity', description: 'Manages streetlight and electrical issues' },
      { name: 'Parks & Recreation', description: 'Maintains parks and public recreational spaces' },
      { name: 'Public Health', description: 'Handles public health and hygiene concerns' }
    ]);
    console.log(`Created ${departments.length} departments`);

    // Create categories
    const categories = await Category.insertMany([
      { name: 'Potholes', description: 'Road potholes and surface damage' },
      { name: 'Garbage', description: 'Garbage accumulation and waste management' },
      { name: 'Streetlights', description: 'Broken or non-functional streetlights' },
      { name: 'Drainage', description: 'Blocked or overflowing drainage' },
      { name: 'Water Leakage', description: 'Water pipe leaks and supply issues' },
      { name: 'Damaged Roads', description: 'Severely damaged or broken roads' }
    ]);
    console.log(`Created ${categories.length} categories`);

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@civic.gov.in',
      password: 'password',
      role: 'admin',
      phone: '9876543210'
    });

    const officer1 = await User.create({
      name: 'Rajan Kumar',
      email: 'rajan.kumar@civic.gov.in',
      password: 'password',
      role: 'officer',
      phone: '9876543211',
      department: departments[0]._id // Roads & Infrastructure
    });

    const officer2 = await User.create({
      name: 'Sunita Verma',
      email: 'sunita.verma@civic.gov.in',
      password: 'password',
      role: 'officer',
      phone: '9876543212',
      department: departments[2]._id // Sanitation
    });

    const citizen = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      password: 'password',
      role: 'citizen',
      phone: '9876543213'
    });

    console.log('Created users:');
    console.log(`  Admin:   admin@civic.gov.in / password`);
    console.log(`  Officer: rajan.kumar@civic.gov.in / password`);
    console.log(`  Officer: sunita.verma@civic.gov.in / password`);
    console.log(`  Citizen: priya.sharma@email.com / password`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
