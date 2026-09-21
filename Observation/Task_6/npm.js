// Import the Express package
const express = require("express");

// Create an Express application
const app = express();

// Define a route for the home page
app.get("/", (req, res) => {
    // Send a response to the browser
    res.send("Welcome to my Node.js application!");
});

// Define another route
app.get("/about", (req, res) => {
    // Send response for the About page
    res.send("This is the About Page.");
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});