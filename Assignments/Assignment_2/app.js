/**
 * =============================================================================
 * Student Information Management System (Node.js & MongoDB Official Driver)
 * Database: collegeDB
 * Collection: students
 * =============================================================================
 */

const { MongoClient } = require("mongodb");
const readline = require("readline");

// Initial sample data
const SAMPLE_STUDENTS = [
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
];

function printTable(students, title = "Student Records") {
  console.log(`\n${"=".repeat(75)}`);
  console.log(`  ${title.toUpperCase()} (Count: ${students.length})`);
  console.log(`${"=".repeat(75)}`);
  if (!students || students.length === 0) {
    console.log("  [No matching records found]");
    console.log(`${"=".repeat(75)}\n`);
    return;
  }

  const pad = (str, len) => String(str || "N/A").padEnd(len);
  console.log(`${pad("Roll No", 10)} | ${pad("Name", 18)} | ${pad("Branch", 10)} | ${pad("Year", 5)} | ${pad("Marks", 6)} | Email`);
  console.log("-".repeat(75));
  students.forEach((s) => {
    console.log(`${pad(s.rollNo, 10)} | ${pad(s.name, 18)} | ${pad(s.branch, 10)} | ${pad(s.year, 5)} | ${pad(s.marks, 6)} | ${s.email || "N/A"}`);
  });
  console.log(`${"=".repeat(75)}\n`);
}

class StudentDBManager {
  constructor(uri = "mongodb://localhost:27017") {
    this.uri = uri;
    this.isLive = false;
    this.client = null;
    this.db = null;
    this.collection = null;
    this.inMemoryDocs = [];
    this.indexedFields = new Set();
  }

  async connect() {
    try {
      this.client = new MongoClient(this.uri, { serverSelectionTimeoutMS: 2000 });
      await this.client.connect();
      await this.client.db("admin").command({ ping: 1 });
      this.db = this.client.db("collegeDB");
      this.collection = this.db.collection("students");
      this.isLive = true;
      console.log(`[CONNECTED] Connected to live MongoDB at ${this.uri}`);
    } catch (err) {
      console.log(`[NOTE] Local MongoDB server not reachable at ${this.uri} (${err.message}).`);
      console.log("[INFO] Running in In-Memory Simulation Mode (all MongoDB logic fully emulated).");
      this.isLive = false;
      this.inMemoryDocs = SAMPLE_STUDENTS.map((s) => ({ ...s }));
    }
  }

  async close() {
    if (this.client && this.isLive) {
      await this.client.close();
    }
  }

  async seedInitialData() {
    if (this.isLive) {
      try {
        await this.collection.drop();
      } catch (e) {
        // Collection might not exist yet
      }
      await this.collection.insertMany(SAMPLE_STUDENTS.map((s) => ({ ...s })));
      console.log(`[SUCCESS] Seeded ${SAMPLE_STUDENTS.length} records into 'collegeDB.students'`);
    } else {
      this.inMemoryDocs = SAMPLE_STUDENTS.map((s) => ({ ...s }));
      console.log(`[SIMULATION] Seeded ${SAMPLE_STUDENTS.length} records in-memory.`);
    }
  }

  async insertStudent(studentDoc) {
    if (this.isLive) {
      try {
        await this.collection.insertOne(studentDoc);
        return true;
      } catch (err) {
        console.error(`[ERROR] Insert failed: ${err.message}`);
        return false;
      }
    } else {
      if (this.inMemoryDocs.some((s) => s.rollNo === studentDoc.rollNo)) {
        console.log(`[ERROR] Student with Roll No ${studentDoc.rollNo} already exists!`);
        return false;
      }
      this.inMemoryDocs.push({ ...studentDoc });
      return true;
    }
  }

  async getAllStudents() {
    if (this.isLive) {
      return await this.collection.find({}, { projection: { _id: 0 } }).toArray();
    }
    return this.inMemoryDocs.map((s) => ({ ...s }));
  }

  async getStudentsByBranch(branch) {
    if (this.isLive) {
      return await this.collection.find({ branch: branch }, { projection: { _id: 0 } }).toArray();
    }
    return this.inMemoryDocs
      .filter((s) => s.branch && s.branch.toUpperCase() === branch.toUpperCase())
      .map((s) => ({ ...s }));
  }

  async getStudentsAboveMarks(minMarks) {
    if (this.isLive) {
      return await this.collection.find({ marks: { $gt: minMarks } }, { projection: { _id: 0 } }).toArray();
    }
    return this.inMemoryDocs.filter((s) => s.marks > minMarks).map((s) => ({ ...s }));
  }

  async getStudentsBelowMarks(maxMarks) {
    if (this.isLive) {
      return await this.collection.find({ marks: { $lt: maxMarks } }, { projection: { _id: 0 } }).toArray();
    }
    return this.inMemoryDocs.filter((s) => s.marks < maxMarks).map((s) => ({ ...s }));
  }

  async searchByRollNo(rollNo) {
    if (this.isLive) {
      return await this.collection.findOne({ rollNo: rollNo }, { projection: { _id: 0 } });
    }
    const found = this.inMemoryDocs.find((s) => s.rollNo && s.rollNo.toUpperCase() === rollNo.toUpperCase());
    return found ? { ...found } : null;
  }

  async searchCustom(query) {
    if (this.isLive) {
      return await this.collection.find(query, { projection: { _id: 0 } }).toArray();
    }
    return this.inMemoryDocs.filter((s) => {
      let match = true;
      if (query.marks && query.marks.$gte !== undefined && s.marks < query.marks.$gte) match = false;
      if (query.year !== undefined && s.year !== query.year) match = false;
      return match;
    }).map((s) => ({ ...s }));
  }

  async updateStudentMarks(rollNo, newMarks) {
    if (this.isLive) {
      const res = await this.collection.updateOne({ rollNo: rollNo }, { $set: { marks: newMarks } });
      return res.modifiedCount > 0;
    }
    const target = this.inMemoryDocs.find((s) => s.rollNo.toUpperCase() === rollNo.toUpperCase());
    if (target) {
      target.marks = newMarks;
      return true;
    }
    return false;
  }

  async updateStudentField(rollNo, fieldName, newValue) {
    if (this.isLive) {
      const updateObj = {};
      updateObj[fieldName] = newValue;
      const res = await this.collection.updateOne({ rollNo: rollNo }, { $set: updateObj });
      return res.modifiedCount > 0;
    }
    const target = this.inMemoryDocs.find((s) => s.rollNo.toUpperCase() === rollNo.toUpperCase());
    if (target) {
      target[fieldName] = newValue;
      return true;
    }
    return false;
  }

  async deleteByRollNo(rollNo) {
    if (this.isLive) {
      const res = await this.collection.deleteOne({ rollNo: rollNo });
      return res.deletedCount > 0;
    }
    const beforeLen = this.inMemoryDocs.length;
    this.inMemoryDocs = this.inMemoryDocs.filter((s) => s.rollNo.toUpperCase() !== rollNo.toUpperCase());
    return this.inMemoryDocs.length < beforeLen;
  }

  async getStudentsSortedByMarks(descending = true) {
    if (this.isLive) {
      return await this.collection
        .find({}, { projection: { _id: 0 } })
        .sort({ marks: descending ? -1 : 1 })
        .toArray();
    }
    const list = this.inMemoryDocs.map((s) => ({ ...s }));
    return list.sort((a, b) => (descending ? b.marks - a.marks : a.marks - b.marks));
  }

  async getHighestScoringStudent() {
    const list = await this.getStudentsSortedByMarks(true);
    return list.length > 0 ? list[0] : null;
  }

  async createIndexOnRollNo() {
    if (this.isLive) {
      const indexName = await this.collection.createIndex({ rollNo: 1 }, { unique: true });
      return `Index '${indexName}' successfully created on field 'rollNo' with unique constraint.`;
    }
    this.indexedFields.add("rollNo");
    return "Unique Index created on 'rollNo' (Simulated B-Tree index structure).";
  }

  async explainQueryPerformance(rollNo = "23CM001") {
    if (this.isLive) {
      return await this.collection.find({ rollNo: rollNo }).explain("executionStats");
    }
    const isIndexed = this.indexedFields.has("rollNo");
    const totalDocs = this.inMemoryDocs.length;
    return {
      stage: isIndexed ? "IXSCAN (Index Scan) -> FETCH" : "COLLSCAN (Collection Scan)",
      totalDocsExamined: isIndexed ? 1 : totalDocs,
      totalKeysExamined: isIndexed ? 1 : 0,
      explanation: isIndexed
        ? "IXSCAN uses the B-Tree index on rollNo to pinpoint the document in 1 step without scanning entire collection."
        : `COLLSCAN scans all ${totalDocs} documents sequentially from start to end.`
    };
  }
}

async function runFullDemo(dbManager) {
  console.log("\n" + "=".repeat(80));
  console.log("       NODE.JS MONGODB STUDENT DATABASE SYSTEM - EXECUTION DEMO");
  console.log("=".repeat(80));

  // 1. Insert initial records
  console.log("\n[STEP 1] Inserting student records into 'collegeDB.students'...");
  await dbManager.seedInitialData();

  // 2. Display all students
  console.log("\n[STEP 2] Display all students:");
  const allStudents = await dbManager.getAllStudents();
  printTable(allStudents, "All Enrolled Students");

  // 3. Display students of a particular branch
  const branchQuery = "CSE-AIML";
  console.log(`\n[STEP 3] Display students belonging to branch: '${branchQuery}'`);
  const aimlStudents = await dbManager.getStudentsByBranch(branchQuery);
  printTable(aimlStudents, `Students in ${branchQuery}`);

  // 4. Display students who scored more than 75 marks
  console.log("\n[STEP 4] Display students who scored more than 75 marks:");
  const above75 = await dbManager.getStudentsAboveMarks(75);
  printTable(above75, "Students with Marks > 75");

  // 5. Search for a student using rollNo
  const searchRoll = "23CM001";
  console.log(`\n[STEP 5] Search for a student using rollNo: '${searchRoll}'`);
  const foundStudent = await dbManager.searchByRollNo(searchRoll);
  if (foundStudent) {
    printTable([foundStudent], `Search Result for Roll No: ${searchRoll}`);
  }

  // 6. Search students based on specified condition
  console.log("\n[STEP 6] Search students with condition: marks >= 70 AND year == 3");
  const condStudents = await dbManager.searchCustom({ marks: { $gte: 70 }, year: 3 });
  printTable(condStudents, "Filtered Students (Marks >= 70 & Year == 3)");

  // 7. Update marks of a particular student
  const updateRoll = "23CM001";
  const newMarks = 95;
  console.log(`\n[STEP 7] Updating marks for '${updateRoll}' to ${newMarks}...`);
  await dbManager.updateStudentMarks(updateRoll, newMarks);
  const updatedSt = await dbManager.searchByRollNo(updateRoll);
  printTable([updatedSt], `After Updating Marks for ${updateRoll}`);

  // 8. Update another field (email)
  const emailRoll = "23CM002";
  const newEmail = "ananya.sharma2026@university.edu";
  console.log(`\n[STEP 8] Updating email for '${emailRoll}' to '${newEmail}'...`);
  await dbManager.updateStudentField(emailRoll, "email", newEmail);
  const updatedEmailSt = await dbManager.searchByRollNo(emailRoll);
  printTable([updatedEmailSt], `After Updating Email for ${emailRoll}`);

  // 9. Delete a student record using rollNo
  const delRoll = "23CM007";
  console.log(`\n[STEP 9] Deleting student record for '${delRoll}'...`);
  await dbManager.deleteByRollNo(delRoll);
  const remaining = await dbManager.getAllStudents();
  printTable(remaining, `Students After Deletion of ${delRoll}`);

  // 10. Display students in descending order of marks
  console.log("\n[STEP 10] Display students in descending order of marks:");
  const sortedMarks = await dbManager.getStudentsSortedByMarks(true);
  printTable(sortedMarks, "Students Ranked by Marks (High to Low)");

  // 11 & 12. Indexing demonstration
  console.log("\n[STEP 11 & 12] Creating index on 'rollNo' and demonstrating performance benefits...");
  const idxRes = await dbManager.createIndexOnRollNo();
  console.log(`  ${idxRes}`);

  const stats = await dbManager.explainQueryPerformance("23CM001");
  console.log("\n  --- Query Performance Execution Analysis ---");
  console.log(`  Execution Stage     : ${stats.stage || stats.queryPlanner?.winningPlan?.stage}`);
  console.log(`  Total Docs Examined : ${stats.totalDocsExamined ?? stats.executionStats?.totalDocsExamined}`);
  console.log(`  Explanation         : ${stats.explanation || "Execution verified via MongoDB explain plan."}`);

  // 13. Real-Time Extension Queries
  console.log("\n" + "=".repeat(80));
  console.log("                      REAL-TIME EXTENSION QUERIES");
  console.log("=".repeat(80));

  console.log("\n[EXT 1] Students scoring above 80:");
  const above80 = await dbManager.getStudentsAboveMarks(80);
  printTable(above80, "Students Scoring > 80");

  console.log("\n[EXT 2] Students scoring below 50 (Requiring Academic Mentoring):");
  const below50 = await dbManager.getStudentsBelowMarks(50);
  printTable(below50, "Students Scoring < 50");

  console.log("\n[EXT 3] Highest-Scoring Student (Batch Topper):");
  const topper = await dbManager.getHighestScoringStudent();
  if (topper) {
    printTable([topper], "Highest Scorer / Topper");
  }

  console.log("\n[EXT 4] Students belonging to 'CSE' branch:");
  const cseStudents = await dbManager.getStudentsByBranch("CSE");
  printTable(cseStudents, "CSE Branch Students");

  console.log("\n[EXT 5] Final sorted list of students by marks:");
  const finalSorted = await dbManager.getStudentsSortedByMarks(true);
  printTable(finalSorted, "Final Merit List");

  console.log("\n" + "=".repeat(80));
  console.log("                     DEMO COMPLETED SUCCESSFULLY");
  console.log("=".repeat(80) + "\n");
}

function prompt(rl, question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function interactiveMenu(dbManager) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  while (true) {
    console.log("\n" + "=".repeat(50));
    console.log("    COLLEGEDB STUDENT MANAGEMENT (Node.js)");
    console.log("=".repeat(50));
    console.log("1. Seed Sample Student Data");
    console.log("2. Display All Students");
    console.log("3. Insert New Student");
    console.log("4. Display Students by Branch");
    console.log("5. Display Students Scoring > 75 Marks");
    console.log("6. Search Student by Roll No");
    console.log("7. Search by Custom Condition (Marks & Year)");
    console.log("8. Update Marks of Student");
    console.log("9. Update Email/Branch of Student");
    console.log("10. Delete Student Record by Roll No");
    console.log("11. Display Students Sorted by Marks");
    console.log("12. Create Index on Roll No & View Stats");
    console.log("13. [Extension] Find Students Scoring > 80");
    console.log("14. [Extension] Find Students Scoring < 50");
    console.log("15. [Extension] Find Highest-Scoring Student");
    console.log("16. Run Automated Demonstration");
    console.log("0. Exit");
    console.log("=".repeat(50));

    const choice = (await prompt(rl, "Enter your choice (0-16): ")).trim();

    if (choice === "0") {
      console.log("Exiting Student Management System. Goodbye!");
      rl.close();
      await dbManager.close();
      break;
    } else if (choice === "1") {
      await dbManager.seedInitialData();
    } else if (choice === "2") {
      printTable(await dbManager.getAllStudents(), "All Students");
    } else if (choice === "3") {
      const roll = await prompt(rl, "Enter Roll No: ");
      const name = await prompt(rl, "Enter Name: ");
      const branch = await prompt(rl, "Enter Branch (e.g., CSE-AIML): ");
      const year = parseInt(await prompt(rl, "Enter Year (1-4): "), 10);
      const marks = parseFloat(await prompt(rl, "Enter Marks: "));
      const email = await prompt(rl, "Enter Email: ");
      const success = await dbManager.insertStudent({ rollNo: roll, name, branch, year, marks, email });
      if (success) console.log(`[SUCCESS] Student ${name} (${roll}) added successfully.`);
    } else if (choice === "4") {
      const br = await prompt(rl, "Enter Branch Name (e.g. CSE-AIML, CSE, ECE, IT): ");
      printTable(await dbManager.getStudentsByBranch(br), `Students in Branch: ${br}`);
    } else if (choice === "5") {
      printTable(await dbManager.getStudentsAboveMarks(75), "Students with Marks > 75");
    } else if (choice === "6") {
      const roll = await prompt(rl, "Enter Roll No to search: ");
      const st = await dbManager.searchByRollNo(roll);
      if (st) printTable([st], `Student Found: ${roll}`);
      else console.log(`[NOT FOUND] No student found with Roll No ${roll}`);
    } else if (choice === "7") {
      const minM = parseFloat(await prompt(rl, "Enter Minimum Marks: "));
      const yr = parseInt(await prompt(rl, "Enter Year (1-4): "), 10);
      const results = await dbManager.searchCustom({ marks: { $gte: minM }, year: yr });
      printTable(results, `Students with Marks >= ${minM} & Year == ${yr}`);
    } else if (choice === "8") {
      const roll = await prompt(rl, "Enter Roll No to update marks: ");
      const m = parseFloat(await prompt(rl, "Enter new marks: "));
      if (await dbManager.updateStudentMarks(roll, m)) console.log("[SUCCESS] Marks updated successfully.");
      else console.log("[FAILED] Student not found or update failed.");
    } else if (choice === "9") {
      const roll = await prompt(rl, "Enter Roll No: ");
      const field = await prompt(rl, "Enter field to update (email/branch): ");
      const val = await prompt(rl, `Enter new value for ${field}: `);
      if (await dbManager.updateStudentField(roll, field, val)) console.log(`[SUCCESS] Field '${field}' updated.`);
      else console.log("[FAILED] Update failed.");
    } else if (choice === "10") {
      const roll = await prompt(rl, "Enter Roll No to delete: ");
      if (await dbManager.deleteByRollNo(roll)) console.log(`[SUCCESS] Student ${roll} deleted successfully.`);
      else console.log(`[NOT FOUND] No record found for Roll No ${roll}.`);
    } else if (choice === "11") {
      printTable(await dbManager.getStudentsSortedByMarks(true), "Students Sorted by Marks");
    } else if (choice === "12") {
      const res = await dbManager.createIndexOnRollNo();
      console.log(res);
      console.log("\nPerformance stats on search:");
      console.log(await dbManager.explainQueryPerformance("23CM001"));
    } else if (choice === "13") {
      printTable(await dbManager.getStudentsAboveMarks(80), "Students Scoring > 80");
    } else if (choice === "14") {
      printTable(await dbManager.getStudentsBelowMarks(50), "Students Scoring < 50");
    } else if (choice === "15") {
      const topper = await dbManager.getHighestScoringStudent();
      if (topper) printTable([topper], "Highest Scorer");
      else console.log("No records available.");
    } else if (choice === "16") {
      await runFullDemo(dbManager);
    } else {
      console.log("[INVALID] Please select a valid option.");
    }
  }
}

async function main() {
  const args = process.argv.slice(2);
  const uriIndex = args.indexOf("--uri");
  const uri = uriIndex !== -1 && args[uriIndex + 1] ? args[uriIndex + 1] : "mongodb://localhost:27017";
  const isDemo = args.includes("--demo");

  const manager = new StudentDBManager(uri);
  await manager.connect();

  if (isDemo || !process.stdin.isTTY) {
    await runFullDemo(manager);
    await manager.close();
  } else {
    await interactiveMenu(manager);
  }
}

main().catch((err) => {
  console.error("Fatal Error:", err);
});
