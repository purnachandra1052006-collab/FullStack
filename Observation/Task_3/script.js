// Student class to create Student objects
class Student {

    // Constructor initializes student properties
    constructor(name, rn, dept, cgpa) {
        this.name = name;   
        this.rn = rn;       
        this.dept = dept;   
        this.cgpa = cgpa;   
    }
}

// Function to create a Student object from user input
function createstu() {

    // Get values entered in the form
    const name = document.getElementById("iname").value;
    const rn = document.getElementById("irn").value;
    const dept = document.getElementById("idept").value;
    const cgpa = document.getElementById("icgpa").value;

    // Create and return a new Student object
    return new Student(name, rn, dept, cgpa);
}

// Function to display student details on the webpage
function display(stu) {
    document.getElementById("uname").textContent = stu.name;
    document.getElementById("urn").textContent = stu.rn;
    document.getElementById("udept").textContent = stu.dept;
    document.getElementById("ucgpa").textContent = stu.cgpa;
}

// Function called when Submit button is clicked
function submitStudent() {
    // Create Student object using input values
    const stu = createstu();
    // Display the student's details
    display(stu);
}