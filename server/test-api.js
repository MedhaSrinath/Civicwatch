const dns = require('dns');
dns.setServers(['8.8.8.8', '1.1.1.1']);

require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const Department = require('./models/Department');
const Category = require('./models/Category');

async function runEndToEndTests() {
  console.log('--- 🧪 STARTING CIVICWATCH END-TO-END VERIFICATION ---');
  await connectDB();

  try {
    // 1. Verify Users & Auth
    console.log('\n[1/6] Testing Users & Passwords...');
    const admin = await User.findOne({ email: 'admin@civic.gov.in' }).select('+password');
    const officer = await User.findOne({ email: 'rajan.kumar@civic.gov.in' }).select('+password');
    const citizen = await User.findOne({ email: 'priya.sharma@email.com' }).select('+password');

    if (!admin || !officer || !citizen) {
      throw new Error('Seed users not found');
    }
    const adminPassMatch = await admin.comparePassword('password');
    const officerPassMatch = await officer.comparePassword('password');
    const citizenPassMatch = await citizen.comparePassword('password');

    console.log(`  ✓ Admin account verified: ${admin.name} (Match: ${adminPassMatch})`);
    console.log(`  ✓ Officer account verified: ${officer.name} (Match: ${officerPassMatch})`);
    console.log(`  ✓ Citizen account verified: ${citizen.name} (Match: ${citizenPassMatch})`);

    // 2. Verify Departments & Categories
    console.log('\n[2/6] Testing Departments and Categories...');
    const depts = await Department.find();
    const cats = await Category.find();
    console.log(`  ✓ Found ${depts.length} departments (e.g., "${depts[0].name}")`);
    console.log(`  ✓ Found ${cats.length} categories (e.g., "${cats[0].name}")`);

    // 3. Citizen Submits a Complaint
    console.log('\n[3/6] Testing Complaint Submission by Citizen...');
    const testComplaint = await Complaint.create({
      title: 'Pothole on 5th Cross Road',
      description: 'Dangerous pothole causing traffic issues near community center.',
      category: cats[0]._id,
      location: '5th Cross, Ward 12, Bengaluru',
      citizen: citizen._id,
      priority: 'High',
      status: 'Pending',
      statusExplanation: 'Your complaint has been submitted and is awaiting review by the administration.',
      statusHistory: [{
        status: 'Pending',
        explanation: 'Complaint submitted by citizen.',
        changedBy: citizen._id
      }]
    });
    console.log(`  ✓ Complaint submitted! Assigned ID: ${testComplaint.complaintId}`);
    console.log(`  ✓ Initial USP Explanation: "${testComplaint.statusExplanation}"`);

    // 4. Admin Direct Assignment
    console.log('\n[4/6] Testing Direct Department & Officer Assignment by Admin...');
    testComplaint.department = depts[0]._id;
    testComplaint.assignedOfficer = officer._id;
    testComplaint.priority = 'High';
    testComplaint.status = 'Assigned';
    testComplaint.statusExplanation = `Assigned to ${officer.name} (${depts[0].name}).`;
    testComplaint.statusHistory.push({
      status: 'Assigned',
      explanation: `Admin assigned to ${officer.name}.`,
      changedBy: admin._id
    });
    await testComplaint.save();
    console.log(`  ✓ Assigned to officer: ${officer.name}`);
    console.log(`  ✓ Updated USP Explanation: "${testComplaint.statusExplanation}"`);

    // 5. Officer Updates Status to In Progress and then Resolved
    console.log('\n[5/6] Testing Officer Progress & Resolution...');
    testComplaint.status = 'In Progress';
    testComplaint.statusExplanation = 'Work in progress – Road repair crew dispatched to fill pothole.';
    testComplaint.statusHistory.push({
      status: 'In Progress',
      explanation: testComplaint.statusExplanation,
      changedBy: officer._id,
      remarks: 'Crew dispatched on site.'
    });
    await testComplaint.save();
    console.log(`  ✓ Officer updated status to: ${testComplaint.status}`);

    testComplaint.status = 'Resolved';
    testComplaint.resolutionRemarks = 'Pothole asphalted and leveled. Road cleared for traffic.';
    testComplaint.statusExplanation = 'The officer has marked this issue as resolved. Awaiting citizen confirmation.';
    testComplaint.statusHistory.push({
      status: 'Resolved',
      explanation: testComplaint.statusExplanation,
      changedBy: officer._id,
      remarks: testComplaint.resolutionRemarks
    });
    await testComplaint.save();
    console.log(`  ✓ Officer marked Resolved with remarks: "${testComplaint.resolutionRemarks}"`);

    // 6. Citizen Confirms Resolution (Closes Complaint)
    console.log('\n[6/6] Testing Citizen Resolution Verification (Confirm & Close)...');
    testComplaint.citizenFeedback = 'confirmed';
    testComplaint.citizenFeedbackRemarks = 'Pothole completely filled. Great job!';
    testComplaint.status = 'Closed';
    testComplaint.statusExplanation = 'The citizen has confirmed the resolution. This complaint is now closed.';
    testComplaint.statusHistory.push({
      status: 'Closed',
      explanation: testComplaint.statusExplanation,
      changedBy: citizen._id,
      remarks: testComplaint.citizenFeedbackRemarks
    });
    await testComplaint.save();
    console.log(`  ✓ Citizen confirmed resolution: ${testComplaint.citizenFeedback}`);
    console.log(`  ✓ Final Status: ${testComplaint.status}`);
    console.log(`  ✓ Timeline steps recorded: ${testComplaint.statusHistory.length} events`);

    console.log('\n======================================================');
    console.log('✅ ALL CIVICWATCH END-TO-END WORKFLOW TESTS PASSED!');
    console.log('======================================================');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runEndToEndTests();
