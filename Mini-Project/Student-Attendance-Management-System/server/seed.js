import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Student from './models/Student.js';
import Attendance from './models/Attendance.js';
import LeaveRequest from './models/LeaveRequest.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/attendance_system_db';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await Student.deleteMany({});
    await Attendance.deleteMany({});
    await LeaveRequest.deleteMany({});

    // 1. Create Faculty
    const faculty = await Student.create({
      name: 'Dr. Alan Turing',
      email: 'faculty@college.edu',
      password: 'password123',
      role: 'faculty',
      department: 'Computer Science'
    });

    // 2. Create Students
    const student1 = await Student.create({
      name: 'John Doe',
      email: 'john@student.edu',
      password: 'password123',
      role: 'student',
      rollNumber: 'CS2024-001',
      department: 'Computer Science'
    });

    const student2 = await Student.create({
      name: 'Jane Smith',
      email: 'jane@student.edu',
      password: 'password123',
      role: 'student',
      rollNumber: 'CS2024-002',
      department: 'Computer Science'
    });

    const student3 = await Student.create({
      name: 'Alex Johnson',
      email: 'alex@student.edu',
      password: 'password123',
      role: 'student',
      rollNumber: 'CS2024-003',
      department: 'Computer Science'
    });

    console.log('✅ Created Faculty and Students');

    // 3. Create Sample Attendance records for John Doe
    const subjects = ['Data Structures', 'Database Management', 'Web Technologies', 'Operating Systems'];
    const dates = ['2026-10-01', '2026-10-02', '2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08'];

    const attendanceRecords = [];

    // John Doe records
    dates.forEach((date, dateIdx) => {
      subjects.forEach((subject, subIdx) => {
        // Create realistic distribution (some present, few absent)
        const isAbsent = (dateIdx + subIdx) % 5 === 0;
        attendanceRecords.push({
          studentId: student1._id,
          subject,
          date,
          status: isAbsent ? 'Absent' : 'Present'
        });
      });
    });

    // Jane Smith records
    dates.forEach((date, dateIdx) => {
      subjects.forEach((subject, subIdx) => {
        const isAbsent = (dateIdx + subIdx) % 3 === 0;
        attendanceRecords.push({
          studentId: student2._id,
          subject,
          date,
          status: isAbsent ? 'Absent' : 'Present'
        });
      });
    });

    await Attendance.insertMany(attendanceRecords);
    console.log(`✅ Seeded ${attendanceRecords.length} Attendance records`);

    // 4. Create Sample Leave Requests
    await LeaveRequest.create([
      {
        studentId: student1._id,
        startDate: '2026-10-12',
        endDate: '2026-10-14',
        reason: 'Attending National Hackathon Conference',
        status: 'Approved',
        facultyRemarks: 'Approved. Good luck!'
      },
      {
        studentId: student1._id,
        startDate: '2026-10-20',
        endDate: '2026-10-21',
        reason: 'Family medical emergency',
        status: 'Pending',
        facultyRemarks: ''
      },
      {
        studentId: student2._id,
        startDate: '2026-10-15',
        endDate: '2026-10-16',
        reason: 'Fever and doctor appointment',
        status: 'Pending',
        facultyRemarks: ''
      }
    ]);

    console.log('✅ Seeded Leave Requests');

    console.log('\n==========================================');
    console.log('🎉 Database seeding completed successfully!');
    console.log('Sample Accounts:');
    console.log('Faculty:  email: faculty@college.edu | password: password123');
    console.log('Student:  email: john@student.edu    | password: password123 (Roll: CS2024-001)');
    console.log('Student:  email: jane@student.edu    | password: password123 (Roll: CS2024-002)');
    console.log('==========================================\n');

    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding error:', err.message);
    process.exit(1);
  }
};

seedData();
