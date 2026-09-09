// Predefined Modules

// Os Module
console.log("\nOS Module\n");
const os = require('os');

console.log(`OS Platform: ${os.platform()}`); 
console.log(`CPU Architecture: ${os.arch()}`);
console.log(`Total Memory: ${os.totalmem()} bytes`);
console.log(`Free Memory: ${os.freemem()} bytes`);
console.log(`Current User Info:`, os.userInfo());

// DNS Module
console.log("\nDNS Module\n");

const dns = require('dns');
const { error } = require('console');

dns.lookup( "google.com", (err, address, family) => {
    if (err) {
        throw error;
    }
    console.log(`The Address : ${address}`);
    console.log(`The Family : ${family}`);
})




