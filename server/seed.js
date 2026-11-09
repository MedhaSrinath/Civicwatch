const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

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

    const Complaint = require('./models/Complaint');
    await Complaint.deleteMany({});

    // Seed Complaints with realistic Bengaluru Coordinates
    const complaints = await Complaint.insertMany([
      {
        complaintId: 'CW-2026-00001',
        title: 'Dangerous Pothole on 100ft Road',
        description: 'Large pothole in the right lane near Indiranagar metro station causing severe bike swerving.',
        category: categories[0]._id, // Potholes
        location: '100ft Road, Indiranagar, Ward 104',
        coordinates: { lat: 12.9784, lng: 77.6408 },
        citizen: citizen._id,
        department: departments[0]._id, // Roads
        assignedOfficer: officer1._id,
        priority: 'High',
        status: 'Resolved',
        statusExplanation: 'The officer has marked this issue as resolved. Awaiting citizen confirmation.',
        resolutionRemarks: 'Asphalt patched, rolled and inspected by junior engineer.',
        statusHistory: [
          { status: 'Pending', explanation: 'Complaint submitted by citizen.', changedBy: citizen._id },
          { status: 'Assigned', explanation: 'Admin assigned complaint to officer Rajan Kumar.', changedBy: admin._id },
          { status: 'In Progress', explanation: 'Road repair crew dispatched on site.', changedBy: officer1._id },
          { status: 'Resolved', explanation: 'The officer has marked this issue as resolved.', changedBy: officer1._id }
        ]
      },
      {
        complaintId: 'CW-2026-00002',
        title: 'Overflowing Garbage Bin near Vegetable Market',
        description: 'Garbage accumulation overflowing on the sidewalk for 3 consecutive days.',
        category: categories[1]._id, // Garbage
        location: '8th Cross, Sampige Road, Malleshwaram',
        coordinates: { lat: 13.0031, lng: 77.5643 },
        citizen: citizen._id,
        priority: 'High',
        status: 'Pending',
        statusExplanation: 'Your complaint has been submitted and is awaiting review by the administration.',
        statusHistory: [
          { status: 'Pending', explanation: 'Complaint submitted by citizen.', changedBy: citizen._id }
        ]
      },
      {
        complaintId: 'CW-2026-00003',
        title: 'Streetlights Out for 200m Stretch',
        description: 'Multiple streetlights non-operational creating dangerous dark spot for pedestrians.',
        category: categories[2]._id, // Streetlights
        location: '5th Block, Koramangala 80ft Road',
        coordinates: { lat: 12.9352, lng: 77.6245 },
        citizen: citizen._id,
        department: departments[3]._id, // Electricity
        assignedOfficer: officer1._id,
        priority: 'Medium',
        status: 'In Progress',
        statusExplanation: 'Work in progress – Electrician team replacing damaged timer switch and LED bulbs.',
        statusHistory: [
          { status: 'Pending', explanation: 'Complaint submitted by citizen.', changedBy: citizen._id },
          { status: 'Assigned', explanation: 'Admin assigned complaint to officer.', changedBy: admin._id },
          { status: 'In Progress', explanation: 'Electrician team replacing damaged timer switch.', changedBy: officer1._id }
        ]
      },
      {
        complaintId: 'CW-2026-00004',
        title: 'Open Drainage Manhole Cover Missing',
        description: 'Stormwater manhole lid damaged and missing. High pedestrian risk especially at night.',
        category: categories[3]._id, // Drainage
        location: '4th Block, 11th Main Road, Jayanagar',
        coordinates: { lat: 12.9250, lng: 77.5938 },
        citizen: citizen._id,
        department: departments[0]._id, // Roads
        assignedOfficer: officer1._id,
        priority: 'High',
        status: 'Assigned',
        statusExplanation: 'Your complaint has been reviewed and assigned to a responsible officer.',
        statusHistory: [
          { status: 'Pending', explanation: 'Complaint submitted by citizen.', changedBy: citizen._id },
          { status: 'Assigned', explanation: 'Admin assigned complaint to officer.', changedBy: admin._id }
        ]
      },
      {
        complaintId: 'CW-2026-00005',
        title: 'Broken Water Supply Feeder Pipe',
        description: 'Clean drinking water gushing onto the road from underground feeder line.',
        category: categories[4]._id, // Water Leakage
        location: 'Sector 2, 14th Main, HSR Layout',
        coordinates: { lat: 12.9121, lng: 77.6446 },
        citizen: citizen._id,
        department: departments[1]._id, // Water Supply
        assignedOfficer: officer2._id,
        priority: 'High',
        status: 'Reopened',
        statusExplanation: 'Citizen disputed the resolution – Valve still leaking under pressure.',
        citizenFeedback: null,
        citizenFeedbackRemarks: 'Valve was wrapped with tape but started leaking again within 2 hours.',
        statusHistory: [
          { status: 'Pending', explanation: 'Complaint submitted by citizen.', changedBy: citizen._id },
          { status: 'Assigned', explanation: 'Admin assigned complaint to officer.', changedBy: admin._id },
          { status: 'Resolved', explanation: 'Officer marked resolved.', changedBy: officer2._id },
          { status: 'Reopened', explanation: 'Citizen disputed the resolution – Valve still leaking under pressure.', changedBy: citizen._id }
        ]
      }
    ]);
    console.log(`Created ${complaints.length} sample complaints with Bengaluru coordinates`);

    console.log('\nSeed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();
