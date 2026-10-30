import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    startDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Start date is required']
    },
    endDate: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'End date is required']
    },
    reason: {
      type: String,
      required: [true, 'Reason is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending'
    },
    facultyRemarks: {
      type: String,
      default: '',
      trim: true
    }
  },
  {
    timestamps: true
  }
);

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);
export default LeaveRequest;
