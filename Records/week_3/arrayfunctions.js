// Arrays and Functions

let numbers = [];

function addNumber(num) {
    numbers.push(num);
    console.log(`Added: ${num}`);
}

function displayAll() {
    console.log("\nNumbers:", numbers.join(" | "),"\n");
}

function getSum() {
    let sum = 0;
    for (let i = 0; i < numbers.length; i++) {
        sum += numbers[i];
    }
    console.log(`Sum = ${sum}\n`);
    return sum;
}

function getAverage() {
    if (numbers.length === 0) {
        console.log("Average = 0\n");
        return 0;
    }
    let sum = getSum();
    let avg = sum / numbers.length;
    console.log(`Average = ${avg.toFixed(2)}\n`);
    return avg;
}


function removeNumber(num) {
    let idx = numbers.indexOf(num);
    if (idx !== -1) {
        numbers.splice(idx, 1);
        console.log(`Removed: ${num}\n`);
    } else {
        console.log(`${num} not found\n`);
    }
}


function clearAll() {
    numbers = [];
    console.log("Cleared all numbers\n");
}


addNumber(8);
addNumber(3);
addNumber(15);
addNumber(6);
addNumber(22);

displayAll();

getSum();

getAverage();

removeNumber(15);

displayAll();

removeNumber(99);
displayAll()

clearAll();
displayAll();

getAverage();