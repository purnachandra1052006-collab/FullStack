import express from 'express';
import LeaveRequest from '../models/LeaveRequest.js';

const router = express.Router();

// Apply for leave (Student)
router.post('/apply', async (req, res) => {
  try {
    const { studentId, startDate, endDate, reason } = req.body;

    if (!studentId || !startDate || !endDate || !reason) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const leave = new LeaveRequest({
      studentId,
      startDate,
      endDate,
      reason
    });

    await leave.save();
    res.status(201).json({ success: true, message: 'Leave request submitted successfully', data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all leaves for a specific student
router.get('/student/:studentId', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find({ studentId: req.params.studentId }).sort({ createdAt: -1 });
    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all leaves for faculty dashboard
router.get('/all', async (req, res) => {
  try {
    const leaves = await LeaveRequest.find()
      .populate('studentId', 'name email rollNumber department')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leaves.length, data: leaves });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update leave request status (Faculty - Approve / Reject)
router.put('/:id', async (req, res) => {
  try {
    const { status, facultyRemarks } = req.body;

    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const leave = await LeaveRequest.findByIdAndUpdate(
      req.params.id,
      { status, facultyRemarks: facultyRemarks || '' },
      { new: true }
    ).populate('studentId', 'name email rollNumber department');

    if (!leave) {
      return res.status(404).json({ success: false, message: 'Leave request not found' });
    }

    res.json({ success: true, message: `Leave request ${status.toLowerCase()} successfully`, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
