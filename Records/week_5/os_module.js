const os = require("os");

// Returns the operating system platform
console.log("os.platform():", os.platform());

// Returns the CPU architecture
console.log("os.arch():", os.arch());

// Returns total system memory in bytes
console.log("os.totalmem():", os.totalmem());

// Returns free system memory in bytes
console.log("os.freemem():", os.freemem());

// Returns the hostname of the operating system
console.log("os.hostname():", os.hostname());

// Returns the current user's home directory
console.log("os.homedir():", os.homedir());

// Returns the default directory for temporary files
console.log("os.tmpdir():", os.tmpdir());

// Returns system uptime in seconds
console.log("os.uptime():", os.uptime());

// Returns information about the current user
console.log("os.userInfo():", os.userInfo());

// Returns the operating system name
console.log("os.type():", os.type());

// Returns the operating system release/version
console.log("os.release():", os.release());