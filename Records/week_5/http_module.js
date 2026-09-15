const http = require("http");

// Create a web server
const server = http.createServer((req, res) => {

    // Send text data to the client/browser
    res.write("Hello World");

    // End the response and send it to the client
    res.end();
});

// Start the server and listen on port 3000
server.listen(3000);

console.log("Server is running at http://localhost:3000");