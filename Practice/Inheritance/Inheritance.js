// Single Inheritance
class Person{
    constructor(name, year) {
    this.name = name;
    this.year = year;
    }

    display(){
        console.log(this.name);
        console.log(this.year);
    }

    age() {
        return 2026-this.year
    }
}

const p1 = new Person("charan", "2006");
p1.display();
console.log(p1.age());

class Student extends Person{
    constructor(name,year,gpa,branch) {
        super(name,year);
        this.branch=branch;
        this.gpa=gpa;
    }

    display(){
        super.display();
        console.log(this.gpa);
        console.log(this.branch);
    }
}

const s1=new Student("Purna","2006","9","CSM");
s1.display();

// Multi-Level Inheritance
class GradStudent extends Student{
    constructor(name,year,gpa,branch,hired_company) {
        super(name,year,gpa,branch)
        this.hired_company=hired_company;
    }

    display(){
        super.display();
        console.log(this.hired_company);
    }
}

const g1=new GradStudent("Purna","2006","9","CSM","Infosys");
g1.display();