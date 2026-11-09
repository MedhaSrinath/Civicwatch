const mongoose = require('mongoose');

const statusHistorySchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Reopened']
  },
  explanation: {
    type: String,
    required: true
  },
  changedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: {
    type: String
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    unique: true
  },
  title: {
    type: String,
    required: [true, 'Complaint title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  coordinates: {
    lat: { type: Number, default: null },
    lng: { type: Number, default: null }
  },
  photo: {
    type: String // file path for uploaded evidence photo
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department'
  },
  assignedOfficer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Reopened'],
    default: 'Pending'
  },
  statusExplanation: {
    type: String,
    default: 'Your complaint has been submitted and is awaiting review by the administration.'
  },
  statusHistory: [statusHistorySchema],
  resolutionRemarks: {
    type: String
  },
  resolutionPhoto: {
    type: String // file path for resolution evidence photo
  },
  citizenFeedback: {
    type: String,
    enum: ['confirmed', 'disputed', null],
    default: null
  },
  citizenFeedbackRemarks: {
    type: String
  }
}, {
  timestamps: true
});

// Auto-generate complaint ID before saving
complaintSchema.pre('save', async function(next) {
  if (!this.complaintId) {
    const count = await mongoose.model('Complaint').countDocuments();
    const num = String(count + 1).padStart(5, '0');
    this.complaintId = `CW-${new Date().getFullYear()}-${num}`;
  }
  next();
});

module.exports = mongoose.model('Complaint', complaintSchema);
