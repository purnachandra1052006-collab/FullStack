import express from 'express';
import Student from '../models/Student.js';

const router = express.Router();

// Register new user (Student or Faculty)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, rollNumber, department } = req.body;

    // Check if user already exists
    const existingUser = await Student.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email already exists' });
    }

    if (role === 'student' && rollNumber) {
      const existingRoll = await Student.findOne({ rollNumber });
      if (existingRoll) {
        return res.status(400).json({ success: false, message: 'Roll number already registered' });
      }
    }

    const newUser = new Student({
      name,
      email,
      password, // Plain text for simplicity per educational FSWD requirements
      role: role || 'student',
      rollNumber: role === 'faculty' ? undefined : rollNumber,
      department: department || 'Computer Science'
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        rollNumber: newUser.rollNumber,
        department: newUser.department
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await Student.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        rollNumber: user.rollNumber,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
