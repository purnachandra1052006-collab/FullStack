// -------------------------------
// Example of a JavaScript Function
// -------------------------------

function add(a, b) {
    // Function performs a specific task
    return a + b;
}

console.log("Sum:", add(10, 20));


// -------------------------------
// Example of a JavaScript Class
// -------------------------------

class Student {

    // Constructor initializes object properties
    constructor(name, rollNo, branch) {
        this.name = name;
        this.rollNo = rollNo;
        this.branch = branch;
    }

    // Method common to all Student objects
    displayDetails() {
        console.log("Name:", this.name);
        console.log("Roll No:", this.rollNo);
        console.log("Branch:", this.branch);
    }
}


// Creating multiple objects from the same class

let student1 = new Student("Rahul", 101, "CSE");
let student2 = new Student("Priya", 102, "AI & ML");
let student3 = new Student("Arun", 103, "ECE");


// Calling the common method for each object

console.log("Student 1:");
student1.displayDetails();

console.log("\nStudent 2:");
student2.displayDetails();

console.log("\nStudent 3:");
student3.displayDetails();