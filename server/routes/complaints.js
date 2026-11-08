const express = require('express');
const { body } = require('express-validator');
const {
  createComplaint, getComplaints, getComplaint,
  assignComplaint, updateComplaintStatus, citizenFeedback, getStats
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Stats route must be before /:id to avoid conflict
router.get('/stats', protect, authorize('admin'), getStats);

router.route('/')
  .get(protect, getComplaints)
  .post(protect, authorize('citizen'), upload.single('photo'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('location').trim().notEmpty().withMessage('Location is required')
  ], createComplaint);

router.get('/:id', protect, getComplaint);
router.put('/:id/assign', protect, authorize('admin'), assignComplaint);
router.put('/:id/status', protect, authorize('officer'), upload.single('resolutionPhoto'), updateComplaintStatus);
router.put('/:id/feedback', protect, authorize('citizen'), citizenFeedback);

module.exports = router;
