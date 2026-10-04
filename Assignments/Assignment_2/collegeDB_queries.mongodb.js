// 1. Switch to (or create) database
use("collegeDB");

// Optional: Clean up existing collection for fresh start
db.students.drop();

// ==============================================================================
// 2. INSERTION: Insert multiple student records (at least 5)
// ==============================================================================
db.students.insertMany([
  {
    rollNo: "23CM001",
    name: "Ravi Kumar",
    branch: "CSE-AIML",
    year: 3,
    marks: 85,
    email: "ravi@example.com"
  },
  {
    rollNo: "23CM002",
    name: "Ananya Sharma",
    branch: "CSE-AIML",
    year: 3,
    marks: 92,
    email: "ananya@example.com"
  },
  {
    rollNo: "23CS015",
    name: "Vikram Singh",
    branch: "CSE",
    year: 2,
    marks: 74,
    email: "vikram@example.com"
  },
  {
    rollNo: "23EC030",
    name: "Pooja Reddy",
    branch: "ECE",
    year: 4,
    marks: 48,
    email: "pooja@example.com"
  },
  {
    rollNo: "23IT012",
    name: "Karthik Verma",
    branch: "IT",
    year: 2,
    marks: 81,
    email: "karthik@example.com"
  },
  {
    rollNo: "23CS045",
    name: "Sneha Patel",
    branch: "CSE",
    year: 3,
    marks: 65,
    email: "sneha@example.com"
  },
  {
    rollNo: "23CM007",
    name: "Rahul Mehta",
    branch: "CSE-AIML",
    year: 1,
    marks: 42,
    email: "rahul@example.com"
  }
]);

// ==============================================================================
// 3. RETRIEVAL OPERATIONS
// ==============================================================================

// a. Display all students
print("--- ALL STUDENTS ---");
db.students.find().pretty();

// b. Display students belonging to a particular branch (e.g., 'CSE-AIML')
print("--- STUDENTS IN CSE-AIML BRANCH ---");
db.students.find({ branch: "CSE-AIML" }).pretty();

// c. Display students who scored more than 75 marks
print("--- STUDENTS WITH MARKS > 75 ---");
db.students.find({ marks: { $gt: 75 } }).pretty();

// d. Search for a student using rollNo
print("--- SEARCH STUDENT BY ROLL NO: 23CM001 ---");
db.students.find({ rollNo: "23CM001" }).pretty();

// e. Search students based on specified conditions (marks >= 70 AND year == 3)
print("--- STUDENTS WITH MARKS >= 70 AND YEAR == 3 ---");
db.students.find({
  $and: [
    { marks: { $gte: 70 } },
    { year: 3 }
  ]
}).pretty();

// ==============================================================================
// 4. UPDATE OPERATIONS
// ==============================================================================

// a. Update marks of a particular student
print("--- UPDATING MARKS FOR 23CM001 TO 95 ---");
db.students.updateOne(
  { rollNo: "23CM001" },
  { $set: { marks: 95 } }
);

// b. Update another field (e.g., email or branch)
print("--- UPDATING EMAIL FOR 23CM002 ---");
db.students.updateOne(
  { rollNo: "23CM002" },
  { $set: { email: "ananya.sharma2026@university.edu" } }
);

// Verify updates
db.students.find({ rollNo: { $in: ["23CM001", "23CM002"] } }).pretty();

// ==============================================================================
// 5. DELETION OPERATION
// ==============================================================================

// Delete a student record using rollNo
print("--- DELETING STUDENT WITH ROLL NO: 23CM007 ---");
db.students.deleteOne({ rollNo: "23CM007" });

// ==============================================================================
// 6. SORTING OPERATION
// ==============================================================================

// Display students in descending order of marks (-1 for descending, 1 for ascending)
print("--- STUDENTS SORTED BY MARKS (DESCENDING) ---");
db.students.find().sort({ marks: -1 }).pretty();

// ==============================================================================
// 7. INDEXING & PERFORMANCE DEMONSTRATION
// ==============================================================================

// Step 1: Analyze query performance BEFORE index creation (COLLSCAN = Collection Scan)
print("--- EXPLAIN PLAN BEFORE INDEXING (COLLSCAN) ---");
db.students.find({ rollNo: "23CM001" }).explain("executionStats");

// Step 2: Create a unique index on 'rollNo'
print("--- CREATING UNIQUE INDEX ON rollNo ---");
db.students.createIndex({ rollNo: 1 }, { unique: true });

// View existing indexes
db.students.getIndexes();

// Step 3: Analyze query performance AFTER index creation (IXSCAN = Index Scan)
print("--- EXPLAIN PLAN AFTER INDEXING (IXSCAN) ---");
db.students.find({ rollNo: "23CM001" }).explain("executionStats");

//Queries

// Query 1: Find students scoring above 80
print("--- STUDENTS SCORING ABOVE 80 ---");
db.students.find({ marks: { $gt: 80 } }).pretty();

// Query 2: Find students scoring below 50 (need academic support)
print("--- STUDENTS SCORING BELOW 50 ---");
db.students.find({ marks: { $lt: 50 } }).pretty();

// Query 3: Find the highest-scoring student (Topper)
print("--- HIGHEST-SCORING STUDENT ---");
db.students.find().sort({ marks: -1 }).limit(1).pretty();

// Query 4: Find students belonging to a particular branch (e.g. 'CSE')
print("--- CSE BRANCH STUDENTS ---");
db.students.find({ branch: "CSE" }).pretty();

// Query 5: Display students sorted according to marks (ascending / descending)
print("--- ALL STUDENTS SORTED BY MARKS (HIGH TO LOW) ---");
db.students.find({}, { _id: 0, rollNo: 1, name: 1, branch: 1, marks: 1 }).sort({ marks: -1 }).pretty();

// Query 6 (Bonus Aggregation): Branch-wise average marks & student count
print("--- BONUS: BRANCH-WISE PERFORMANCE SUMMARY ---");
db.students.aggregate([
  {
    $group: {
      _id: "$branch",
      totalStudents: { $sum: 1 },
      avgMarks: { $avg: "$marks" },
      maxMarks: { $max: "$marks" },
      minMarks: { $min: "$marks" }
    }
  },
  { $sort: { avgMarks: -1 } }
]);
