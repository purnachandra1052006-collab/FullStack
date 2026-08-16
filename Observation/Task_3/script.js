class Student {
    constructor(name, rn, dept, cgpa) {
        this.name = name;
        this.rn = rn;
        this.dept = dept;
        this.cgpa = cgpa;
    }
}

function createstu() {
    let name = document.getElementById("iname").value;
    let rn = document.getElementById("irn").value;
    let dept = document.getElementById("idept").value;
    let cgpa = document.getElementById("icgpa").value;
    
    const stu = new Student(name, rn, dept, cgpa);
    return stu;
}

function display(stu) {
    document.getElementById("uname").innerText = stu.name;
    document.getElementById("urn").innerText = stu.rn;
    document.getElementById("udept").innerText = stu.dept;
    document.getElementById("ucgpa").innerText = stu.cgpa;
}
