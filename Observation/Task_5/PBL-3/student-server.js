const express = require("express");
const app = express();

const students = [
  { id: 1, name: "Rahul", course: "B.Tech" },
  { id: 2, name: "Priya", course: "BCA" },
  { id: 3, name: "Arjun", course: "MBA" },
  { id: 4, name: "Sneha", course: "MCA" },
  { id: 5, name: "Kiran", course: "B.Sc" }
];

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to Student Server");
});

// Get All Students
app.get("/students", (req, res) => {
  res.json(students);
});

// About Route
app.get("/about", (req, res) => {
  res.send("This is a simple Express.js Student Server.");
});

// Start Server
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});