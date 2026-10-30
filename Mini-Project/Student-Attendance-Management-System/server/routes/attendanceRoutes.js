import express from 'express';
import Attendance from '../models/Attendance.js';

const router = express.Router();

// Mark or update attendance (single or bulk for a class)
router.post('/mark', async (req, res) => {
  try {
    const { subject, date, records } = req.body;
    // records is an array of { studentId, status: 'Present' | 'Absent' }
    // or single object { studentId, subject, date, status }

    if (!subject || !date) {
      return res.status(400).json({ success: false, message: 'Subject and date are required' });
    }

    if (Array.isArray(records)) {
      const ops = records.map(rec => ({
        updateOne: {
          filter: { studentId: rec.studentId, subject, date },
          update: { $set: { studentId: rec.studentId, subject, date, status: rec.status } },
          upsert: true
        }
      }));

      await Attendance.bulkWrite(ops);
      return res.json({ success: true, message: `Attendance recorded for ${records.length} students` });
    }

    // Single record
    const { studentId, status } = req.body;
    if (!studentId || !status) {
      return res.status(400).json({ success: false, message: 'studentId and status are required' });
    }

    const attendanceRecord = await Attendance.findOneAndUpdate(
      { studentId, subject, date },
      { studentId, subject, date, status },
      { new: true, upsert: true }
    );

    res.json({ success: true, message: 'Attendance marked successfully', data: attendanceRecord });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get attendance history and subject-wise breakdown for a student
router.get('/student/:studentId', async (req, res) => {
  try {
    const { studentId } = req.params;

    const records = await Attendance.find({ studentId }).sort({ date: -1 });

    // Compute stats
    const totalClasses = records.length;
    const presentClasses = records.filter(r => r.status === 'Present').length;
    const absentClasses = totalClasses - presentClasses;
    const overallPercentage = totalClasses > 0 ? ((presentClasses / totalClasses) * 100).toFixed(1) : 0;

    // Subject-wise stats calculation
    const subjectMap = {};
    records.forEach(r => {
      if (!subjectMap[r.subject]) {
        subjectMap[r.subject] = { total: 0, present: 0, absent: 0 };
      }
      subjectMap[r.subject].total += 1;
      if (r.status === 'Present') {
        subjectMap[r.subject].present += 1;
      } else {
        subjectMap[r.subject].absent += 1;
      }
    });

    const subjectWise = Object.keys(subjectMap).map(subject => {
      const stats = subjectMap[subject];
      const percentage = stats.total > 0 ? ((stats.present / stats.total) * 100).toFixed(1) : 0;
      return {
        subject,
        total: stats.total,
        present: stats.present,
        absent: stats.absent,
        percentage: Number(percentage)
      };
    });

    res.json({
      success: true,
      data: {
        totalClasses,
        presentClasses,
        absentClasses,
        overallPercentage: Number(overallPercentage),
        subjectWise,
        records
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all attendance logs (for faculty view)
router.get('/all', async (req, res) => {
  try {
    const records = await Attendance.find()
      .populate('studentId', 'name rollNumber department')
      .sort({ date: -1 })
      .limit(100);

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
