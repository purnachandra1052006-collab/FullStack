import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Date is required']
    },
    status: {
      type: String,
      enum: ['Present', 'Absent'],
      required: true,
      default: 'Present'
    }
  },
  {
    timestamps: true
  }
);

// Prevent duplicate attendance records for the same student, subject, and date
attendanceSchema.index({ studentId: 1, subject: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
export default Attendance;
