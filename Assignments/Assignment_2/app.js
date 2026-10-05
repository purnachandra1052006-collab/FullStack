const { MongoClient } = require("mongodb");

const url = "mongodb://localhost:27017";
const client = new MongoClient(url);

async function main() {
    await client.connect();

    const db = client.db("collegeDB");
    const students = db.collection("students");

    // 1. Insert students
    await students.insertMany([
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
        }
    ]);

    console.log("Students inserted.");

    // 2. Display all students
    console.log("\nAll Students:");
    console.log(await students.find().toArray());

    // 3. Display students from CSE-AIML
    console.log("\nCSE-AIML Students:");
    console.log(await students.find({ branch: "CSE-AIML" }).toArray());

    // 4. Students scoring more than 75
    console.log("\nStudents scoring more than 75:");
    console.log(await students.find({ marks: { $gt: 75 } }).toArray());

    // 5. Search using rollNo
    console.log("\nStudent with Roll No 23CM001:");
    console.log(await students.findOne({ rollNo: "23CM001" }));

    // 6. Search using condition
    console.log("\nStudents with marks >= 80:");
    console.log(await students.find({ marks: { $gte: 80 } }).toArray());

    // 7. Update marks
    await students.updateOne(
        { rollNo: "23CM001" },
        { $set: { marks: 95 } }
    );
    console.log("\nMarks updated.");

    // 8. Update email
    await students.updateOne(
        { rollNo: "23CM002" },
        { $set: { email: "ananya2026@example.com" } }
    );
    console.log("Email updated.");

    // 9. Delete a student
    await students.deleteOne({ rollNo: "23IT012" });
    console.log("Student deleted.");

    // 10. Sort students by marks
    console.log("\nStudents in descending order of marks:");
    console.log(
        await students.find().sort({ marks: -1 }).toArray()
    );

    // 11. Create index on rollNo
    await students.createIndex({ rollNo: 1 });
    console.log("\nIndex created on rollNo.");

    // 12. Real-Time Extension

    // Students scoring above 80
    console.log("\nStudents scoring above 80:");
    console.log(await students.find({ marks: { $gt: 80 } }).toArray());

    // Students scoring below 50
    console.log("\nStudents scoring below 50:");
    console.log(await students.find({ marks: { $lt: 50 } }).toArray());

    // Highest-scoring student
    console.log("\nHighest-scoring student:");
    console.log(
        await students.find().sort({ marks: -1 }).limit(1).toArray()
    );

    // Students belonging to CSE branch
    console.log("\nCSE Students:");
    console.log(await students.find({ branch: "CSE" }).toArray());

    // Students sorted by marks
    console.log("\nStudents sorted by marks:");
    console.log(
        await students.find().sort({ marks: -1 }).toArray()
    );

    await client.close();
}

main();