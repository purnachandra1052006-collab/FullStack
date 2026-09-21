// Import Express
const express = require("express");

// Create an Express application
const app = express();


// -----------------------------------
// Middleware for Logging
// -----------------------------------

app.use((req, res, next) => {

    // Display the HTTP method and requested URL
    console.log("Method:", req.method);
    console.log("URL:", req.url);

    // Move the request to the next middleware/route
    next();
});


// -----------------------------------
// Home Route
// -----------------------------------

app.get("/", (req, res) => {

    // Send response to the client
    res.send("Welcome to the Home Page");
});


// -----------------------------------
// About Route
// -----------------------------------

app.get("/about", (req, res) => {

    // Send response to the client
    res.send("This is the About Page");
});


// -----------------------------------
// Start the Server
// -----------------------------------

app.listen(3000, () => {

    // Display message when server starts
    console.log("Server running at http://localhost:3000");
});