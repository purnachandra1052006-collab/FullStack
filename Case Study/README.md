# Student Management System API (Express.js & MongoDB)

A RESTful API built with **Node.js**, **Express.js**, and **MongoDB** (via **Mongoose**) for managing student records. Supports full CRUD operations (Create, Read, Update, Delete), schema validations, error handling, query filtering, and search.

---

## 📁 Project Structure

```
FS-casestudy/
├── config/
│   └── db.js                 # Database connection logic using Mongoose
├── controllers/
│   └── studentController.js  # CRUD operations & business logic
├── models/
│   └── Student.js            # Mongoose schema with data validations
├── routes/
│   └── studentRoutes.js      # Express router mapping endpoints to controller handlers
├── middleware/
│   └── errorHandler.js       # Centralized error handler
├── .env                      # Environment configurations (local)
├── .env.example              # Environment variables template
├── package.json              # Project dependencies and npm scripts
├── requests.http             # Sample HTTP requests for testing
├── server.js                 # Express application entry point
└── README.md                 # Project documentation
```

---

## 🛠️ Prerequisites & Installation

1. **Prerequisites**:
   - [Node.js](https://nodejs.org/) (v16 or higher)
   - [MongoDB](https://www.mongodb.com/) (running locally or MongoDB Atlas connection string)

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create or verify `.env` file in the root directory:
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/student_management_db
   NODE_ENV=development
   ```

4. **Start the Application**:
   - In development mode (auto-reload on change):
     ```bash
     npm run dev
     ```
   - In production mode:
     ```bash
     npm start
     ```

---

## 📡 API Routes & MongoDB Interactions

| Method | Endpoint | Description | MongoDB Interaction |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/students` | Add a new student | `Student.create(req.body)` validates data against schema and creates document in MongoDB. |
| `GET` | `/api/students` | View all students (supports filtering, search, pagination) | `Student.find(query)` queries MongoDB collection with optional regex search and pagination. |
| `GET` | `/api/students/:id` | View single student by MongoDB `_id` or `studentId` | `Student.findById(id)` or `Student.findOne({ studentId: id })` fetches matching document. |
| `PUT` / `PATCH` | `/api/students/:id` | Update student details | `Student.findOneAndUpdate(id, update, { new: true, runValidators: true })` modifies document and returns the updated state. |
| `DELETE` | `/api/students/:id` | Delete a student | `Student.findOneAndDelete(id)` removes document from MongoDB collection. |

---

## 🧪 Testing the API

You can test the endpoints using:
- The included [`requests.http`](./requests.http) file in VS Code with the **REST Client** extension.
- **Postman**, **Insomnia**, or **cURL**.

### Example cURL Commands

#### 1. Add a Student
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{"studentId":"STU1001","name":"Alice Johnson","email":"alice@example.com","course":"Computer Science","age":20,"gpa":3.85}'
```

#### 2. View All Students
```bash
curl http://localhost:5000/api/students
```

#### 3. View Student by ID
```bash
curl http://localhost:5000/api/students/STU1001
```

#### 4. Update Student
```bash
curl -X PUT http://localhost:5000/api/students/STU1001 \
  -H "Content-Type: application/json" \
  -d '{"gpa":3.95,"course":"Software Engineering"}'
```

#### 5. Delete Student
```bash
curl -X DELETE http://localhost:5000/api/students/STU1001
```
