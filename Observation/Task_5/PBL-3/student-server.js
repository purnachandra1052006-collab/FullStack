const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Welcome to Student Server");
});

app.get("/students", (req, res) => {
    res.json([
        "Rahul",
        "Priya",
        "Arjun",
        "Sneha",
        "Kiran"
    ]);
});

app.get("/about", (req, res) => {
    res.send("This is a simple Express.js Student Server.");
});

app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});