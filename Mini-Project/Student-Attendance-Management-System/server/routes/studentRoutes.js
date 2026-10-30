import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// Get all students or search by name / rollNumber
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;
    let query = { role: 'student' };

    if (q) {
      query.$or = [
        { name: { $regex: q, $options: 'i' } },
        { rollNumber: { $regex: q, $options: 'i' } },
        { department: { $regex: q, $options: 'i' } }
      ];
    }

    const students = await Student.find(query).select('-password').sort({ rollNumber: 1 });
    res.json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single student by ID
router.get('/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select('-password');
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    res.json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
