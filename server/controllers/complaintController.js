const Complaint = require('../models/Complaint');
const { validationResult } = require('express-validator');

// @desc    Create a new complaint
// @route   POST /api/complaints
// @access  Private (Citizen)
const createComplaint = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const { title, description, category, location } = req.body;

    const complaintData = {
      title,
      description,
      category,
      location,
      citizen: req.user._id,
      statusExplanation: 'Your complaint has been submitted and is awaiting review by the administration.',
      statusHistory: [{
        status: 'Pending',
        explanation: 'Complaint submitted by citizen.',
        changedBy: req.user._id
      }]
    };

    if (req.file) {
      complaintData.photo = req.file.filename;
    }

    const complaint = await Complaint.create(complaintData);
    const populated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('category', 'name');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error creating complaint' });
  }
};

// @desc    Get all complaints (admin) or user-specific
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res) => {
  try {
    let filter = {};

    if (req.user.role === 'citizen') {
      filter.citizen = req.user._id;
    } else if (req.user.role === 'officer') {
      filter.assignedOfficer = req.user._id;
    }
    // admin gets all

    const { status, priority, category, department } = req.query;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (department) filter.department = department;

    const complaints = await Complaint.find(filter)
      .populate('citizen', 'name email')
      .populate('category', 'name')
      .populate('department', 'name')
      .populate('assignedOfficer', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error fetching complaints' });
  }
};

// @desc    Get single complaint
// @route   GET /api/complaints/:id
// @access  Private
const getComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('citizen', 'name email phone')
      .populate('category', 'name')
      .populate('department', 'name')
      .populate('assignedOfficer', 'name email phone')
      .populate('statusHistory.changedBy', 'name role');

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Authorization: citizens can only see their own, officers only assigned
    if (req.user.role === 'citizen' && complaint.citizen._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }
    if (req.user.role === 'officer' && (!complaint.assignedOfficer || complaint.assignedOfficer._id.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Not authorized to view this complaint' });
    }

    res.json(complaint);
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error fetching complaint' });
  }
};

// @desc    Admin assigns department, officer, priority
// @route   PUT /api/complaints/:id/assign
// @access  Private (Admin)
const assignComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    const { department, assignedOfficer, priority } = req.body;

    if (department) complaint.department = department;
    if (assignedOfficer) complaint.assignedOfficer = assignedOfficer;
    if (priority) complaint.priority = priority;

    if (assignedOfficer) {
      complaint.status = 'Assigned';
      complaint.statusExplanation = 'Your complaint has been reviewed and assigned to a responsible officer.';
      complaint.statusHistory.push({
        status: 'Assigned',
        explanation: 'Admin assigned complaint to an officer.',
        changedBy: req.user._id,
        remarks: req.body.remarks || ''
      });
    }

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('category', 'name')
      .populate('department', 'name')
      .populate('assignedOfficer', 'name email');

    res.json(updated);
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ message: 'Server error assigning complaint' });
  }
};

// @desc    Officer updates complaint status
// @route   PUT /api/complaints/:id/status
// @access  Private (Officer)
const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Verify officer is assigned
    if (!complaint.assignedOfficer || complaint.assignedOfficer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You are not assigned to this complaint' });
    }

    const { status, remarks } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Status is required' });
    }

    const allowedStatuses = ['In Progress', 'Resolved'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'Officers can set status to In Progress or Resolved' });
    }

    complaint.status = status;
    if (remarks) complaint.resolutionRemarks = remarks;

    // Handle resolution photo upload
    if (req.file) {
      complaint.resolutionPhoto = req.file.filename;
    }

    // Generate dynamic status explanation
    if (status === 'In Progress') {
      complaint.statusExplanation = remarks
        ? `Work in progress – ${remarks}`
        : 'The assigned officer is actively working on this complaint.';
    } else if (status === 'Resolved') {
      complaint.statusExplanation = 'The officer has marked this issue as resolved. Awaiting citizen confirmation.';
    }

    complaint.statusHistory.push({
      status,
      explanation: complaint.statusExplanation,
      changedBy: req.user._id,
      remarks: remarks || ''
    });

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('category', 'name')
      .populate('department', 'name')
      .populate('assignedOfficer', 'name email');

    res.json(updated);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};

// @desc    Citizen confirms or disputes resolution
// @route   PUT /api/complaints/:id/feedback
// @access  Private (Citizen)
const citizenFeedback = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    if (complaint.citizen.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (complaint.status !== 'Resolved') {
      return res.status(400).json({ message: 'Can only provide feedback on resolved complaints' });
    }

    const { feedback, remarks } = req.body;
    if (!feedback || !['confirmed', 'disputed'].includes(feedback)) {
      return res.status(400).json({ message: 'Feedback must be confirmed or disputed' });
    }

    complaint.citizenFeedback = feedback;
    complaint.citizenFeedbackRemarks = remarks || '';

    if (feedback === 'confirmed') {
      complaint.status = 'Closed';
      complaint.statusExplanation = 'The citizen has confirmed the resolution. This complaint is now closed.';
    } else {
      complaint.status = 'Reopened';
      complaint.statusExplanation = remarks
        ? `Citizen disputed the resolution – ${remarks}`
        : 'The citizen was not satisfied with the resolution. Complaint has been reopened.';
    }

    complaint.statusHistory.push({
      status: complaint.status,
      explanation: complaint.statusExplanation,
      changedBy: req.user._id,
      remarks: remarks || ''
    });

    // If reopened, reset feedback so officer can resolve again
    if (feedback === 'disputed') {
      complaint.citizenFeedback = null;
    }

    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('citizen', 'name email')
      .populate('category', 'name')
      .populate('department', 'name')
      .populate('assignedOfficer', 'name email');

    res.json(updated);
  } catch (error) {
    console.error('Feedback error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get complaint statistics (admin)
// @route   GET /api/complaints/stats
// @access  Private (Admin)
const getStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const pending = await Complaint.countDocuments({ status: 'Pending' });
    const assigned = await Complaint.countDocuments({ status: 'Assigned' });
    const inProgress = await Complaint.countDocuments({ status: 'In Progress' });
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const closed = await Complaint.countDocuments({ status: 'Closed' });
    const reopened = await Complaint.countDocuments({ status: 'Reopened' });

    // Department-wise stats
    const departmentStats = await Complaint.aggregate([
      { $match: { department: { $ne: null } } },
      { $group: {
        _id: '$department',
        total: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $in: ['$status', ['Resolved', 'Closed']] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'Pending'] }, 1, 0] } }
      }},
      { $lookup: { from: 'departments', localField: '_id', foreignField: '_id', as: 'dept' } },
      { $unwind: '$dept' },
      { $project: { name: '$dept.name', total: 1, resolved: 1, pending: 1 } }
    ]);

    // Priority breakdown
    const priorityStats = await Complaint.aggregate([
      { $group: {
        _id: '$priority',
        count: { $sum: 1 }
      }}
    ]);

    res.json({
      total, pending, assigned, inProgress, resolved, closed, reopened,
      departmentStats,
      priorityStats
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

module.exports = {
  createComplaint, getComplaints, getComplaint,
  assignComplaint, updateComplaintStatus, citizenFeedback, getStats
};
