// Single Inheritance 

// Base class: Vehicle
class Vehicle {
  constructor(make, model, year) {
    this.make = make;
    this.model = model;
    this.year = year;
  }

  // Method to display vehicle information
  display() {
    console.log(`This is a ${this.year} ${this.make} ${this.model}.`);
  }
}

// Derived class: Car extends Vehicle
class Car extends Vehicle {
  constructor(make, model, year, color) {
    super(make, model, year); // Call the constructor of the base class using super
    this.color = color;
  }

  // Method to display car information
  display() {
    super.display(); // Call the display method from the base class
    console.log(`The car is in ${this.color} color.`);
  }
}

const myCar = new Car("Toyota", "Corolla", 2021, "Blue");
myCar.display();
