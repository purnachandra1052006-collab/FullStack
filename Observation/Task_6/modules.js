
// Import built-in Node.js modules
const os = require("os");
const path = require("path");
const fs = require("fs");


// -----------------------------------
// 1. OS MODULE
// -----------------------------------

console.log("=== OS MODULE DETAILS ===");

// Operating System Identification
console.log("Platform (OS Name):", os.platform());
console.log("OS Release:", os.release());
console.log("OS Type:", os.type());

// CPU Information
console.log("Architecture:", os.arch());
console.log("Number of CPU Cores:", os.cpus().length);

// Memory Information
console.log("Total Memory :", os.totalmem());
console.log("Free Memory :", os.freemem());

// Environment & System Context
console.log("Home Directory:", os.homedir());
console.log("System Uptime:", os.uptime());
console.log("Current User:", os.userInfo().username);


// -----------------------------------
// 2. PATH MODULE
// -----------------------------------

console.log("\n=== PATH MODULE DETAILS ===");

// Construct path safely across platforms
let builtPath = path.join(__dirname, "projects", "document.notes.txt");
console.log("Joined Absolute Path:", builtPath);

// Extract individual components
console.log("Directory Name:", path.dirname(builtPath));
console.log("File Name:", path.basename(builtPath));
console.log("File Extension:", path.extname(builtPath));

// Parse path into an object and format back to string
let parsedPath = path.parse(builtPath);
console.log("Parsed Path Object:", parsedPath);
console.log("Reconstructed Path:", path.format(parsedPath));


// -----------------------------------
// 3. FS MODULE
// -----------------------------------

console.log("\n=== FS MODULE DETAILS ===");

// Write content to a file
fs.writeFileSync(sampleFile, "Hello, Node.js!\nThis is a detailed FS module demonstration.");
console.log("File created and initial content written.");

// Append additional content
fs.appendFileSync(sampleFile, "\nAppended Line: Learning file sync operations.");
console.log("Content appended to file.");

// Read file contents
let fileData = fs.readFileSync(sampleFile, "utf8");
console.log("\n--- File Contents ---");
console.log(fileData);


// Clean up created file and directory
fs.unlinkSync(sampleFile);

