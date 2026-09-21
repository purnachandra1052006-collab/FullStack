const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Enter filename: ", (filename) => {
    rl.question("Enter content: ", (content) => {

        // 1. Create/Write the file
        fs.writeFileSync(filename, content);

        // 2. Read the file
        console.log("\nInitial Content:");
        console.log(fs.readFileSync(filename, "utf8"));

        // 3. Append additional content
        rl.question("\nEnter additional content: ", (additional) => {
            fs.appendFileSync(filename, "\n" + additional);

            // 4. Display final contents
            console.log("\nFinal Content:");
            console.log(fs.readFileSync(filename, "utf8"));

            rl.close();
        });
    });
});