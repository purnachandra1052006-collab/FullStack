// Array Declaration and Initialization
const cars = ["Saab", "Volvo", "BMW"];

// const cars= new Array(["Saab", "Volvo", "BMW"]);
let car = cars[0];
console.log(car);

// Array Modication
cars[0]="Honda";
console.log(cars[0]);

// Adding New Elements in Array
cars.push("Toyota");
console.log(cars);

// Removing Elements in Array
cars.pop();
console.log(cars);

// Sample program on Arrays
let scores = [85, 92, 78, 90, 88];

console.log(`Total Sum: ${sum}`);
console.log(`Average Score: ${average}`);

// Sort an Array
console.log(scores.sort());

// Length of an Array
console.log(scores.length);

// For Loop
for (let i = 0; i < scores.length; i++) {
    console.log(`Element at index ${i}: ${scores[i]}`);
}

let sum = 0;

for (let i = 0; i < scores.length; i++) {
    sum += scores[i];
}

let average = sum / scores.length;