const Student = require('../models/Student');
const mongoose = require('mongoose');

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Public
 */
const createStudent = async (req, res, next) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Student added successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all students (with optional filtering, search, and pagination)
 * @route   GET /api/students
 * @access  Public
 */
const getAllStudents = async (req, res, next) => {
  try {
    const { course, search, sortBy = 'createdAt', order = 'desc', page = 1, limit = 20 } = req.query;

    const query = {};

    // Filter by course if provided
    if (course) {
      query.course = { $regex: new RegExp(`^${course}$`, 'i') };
    }

    // Search by student name or studentId
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { studentId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    // Pagination calculations
    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.max(1, parseInt(limit, 10));
    const skip = (pageNum - 1) * limitNum;

    // Sorting
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions = { [sortBy]: sortOrder };

    const totalStudents = await Student.countDocuments(query);
    const students = await Student.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      count: students.length,
      pagination: {
        total: totalStudents,
        page: pageNum,
        pages: Math.ceil(totalStudents / limitNum),
        limit: limitNum,
      },
      data: students,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single student by MongoDB _id or studentId
 * @route   GET /api/students/:id
 * @access  Public
 */
const getStudentById = async (req, res, next) => {
  try {
    const { id } = req.params;

    let student = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      student = await Student.findById(id);
    } else {
      // Allow searching by studentId (e.g. S101) as fallback
      student = await Student.findOne({ studentId: id });
    }

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `Student not found with identifier: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update student details by _id or studentId
 * @route   PUT /api/students/:id
 * @route   PATCH /api/students/:id
 * @access  Public
 */
const updateStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findCriteria = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { studentId: id };

    const student = await Student.findOneAndUpdate(findCriteria, req.body, {
      new: true,
      runValidators: true,
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `Student not found with identifier: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete student by _id or studentId
 * @route   DELETE /api/students/:id
 * @access  Public
 */
const deleteStudent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const findCriteria = mongoose.Types.ObjectId.isValid(id)
      ? { _id: id }
      : { studentId: id };

    const student = await Student.findOneAndDelete(findCriteria);

    if (!student) {
      return res.status(404).json({
        success: false,
        error: `Student not found with identifier: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get course-wise student summary using MongoDB aggregation
 * @route   GET /api/reports/course-summary
 * @access  Public
 */
const getCourseSummary = async (req, res, next) => {
  try {
    const summary = await Student.aggregate([
      {
        $group: {
          _id: '$course',
          studentCount: { $sum: 1 },
          averageGpa: { $avg: '$gpa' },
        },
      },
      {
        $project: {
          _id: 1,
          studentCount: 1,
          averageGpa: { $round: ['$averageGpa', 2] },
        },
      },
      { $sort: { averageGpa: -1 } },
    ]);

    res.status(200).json(summary);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getCourseSummary,
};
