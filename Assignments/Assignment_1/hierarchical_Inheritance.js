// Hierarchical Inheritance

// Base class: Vehicle
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  display() {
    console.log(`This is a ${this.year} ${this.make} ${this.model}.`);
  }
}

// Derived class: Car extends Vehicle
class Car extends Vehicle {
  constructor(make, model, year, color) {
    super(make, model, year);
    this.color = color;
  }

  display() {
    super.display();
    console.log(`The car is in ${this.color} color.\n`);
  }
}

// Derived class: Bike extends Vehicle
class Bike extends Vehicle {
  constructor(make, model, year, type) {
    super(make, model, year);
    this.type = type;
  }

  display() {
    super.display();
    console.log(`The bike is a ${this.type} type.\n`);
  }
}


// Car object
const myCar = new Car("Toyota", "Camry", 2023, "Black");

myCar.display();


// Bike object
const myBike = new Bike("Yamaha", "R15", 2024, "Sports");

myBike.display();