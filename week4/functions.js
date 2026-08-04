// Sample Function
function calculateSum(n) {
    let sum = 0;
    
    for (let i = 1; i <= n; i++) {
        sum += i; 
    }

    return sum;
}

let n = 5;
let result = calculateSum(n);

console.log("The sum of numbers from 1 to " + n + " is: " + result);

// Multiple Arguments
function fullname(firstname,lastname) {
    return firstname + " " + lastname
}

console.log(fullname("purna","chandra"));

// Anonymous Functions
const add = function add(a, b) {return a + b;};
console.log(add(2,3));

