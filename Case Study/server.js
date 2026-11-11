const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const studentRoutes = require('./routes/studentRoutes');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

const path = require('path');
const studentController = require('./controllers/studentController');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health Check API
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'Student Management API is running',
    timestamp: new Date().toISOString(),
  });
});

// Direct Aggregation Report Route
app.get('/api/reports/course-summary', studentController.getCourseSummary);

// API Documentation JSON Route
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Student Management System REST API',
    endpoints: {
      health: 'GET /api/health',
      courseSummary: 'GET /api/reports/course-summary',
      getAllStudents: 'GET /api/students',
      createStudent: 'POST /api/students',
      getStudentById: 'GET /api/students/:id',
      updateStudent: 'PUT or PATCH /api/students/:id',
      deleteStudent: 'DELETE /api/students/:id',
    },
  });
});

// Mount Routes
app.use('/api/students', studentRoutes);

// Catch 404 for unhandled routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`,
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server Running]: Listening on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection Error: ${err.message}`);
  server.close(() => process.exit(1));
});
