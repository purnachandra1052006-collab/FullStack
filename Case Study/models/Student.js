const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    course: {
      type: String,
      required: [true, 'Course is required'],
      trim: true,
    },
    age: {
      type: Number,
      min: [1, 'Age must be greater than 0'],
      max: [120, 'Age cannot exceed 120'],
    },
    gpa: {
      type: Number,
      min: [0.0, 'GPA cannot be less than 0.0'],
      max: [4.0, 'GPA cannot exceed 4.0'],
      default: 0.0,
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Student', studentSchema);
