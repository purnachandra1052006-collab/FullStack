const express = require('express');
const router = express.Router();
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getCourseSummary,
} = require('../controllers/studentController');

// Aggregation report route
router.get('/reports/course-summary', getCourseSummary);

// Routes for /api/students
router
  .route('/')
  .get(getAllStudents)
  .post(createStudent);

// Routes for /api/students/:id
router
  .route('/:id')
  .get(getStudentById)
  .put(updateStudent)
  .patch(updateStudent)
  .delete(deleteStudent);

module.exports = router;
