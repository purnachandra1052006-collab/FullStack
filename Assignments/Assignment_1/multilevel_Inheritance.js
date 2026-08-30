// Multilevel Inheritance

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
    console.log(`The car is in ${this.color} color.`);
  }
}

// Derived class: SportsCar extends Car
class SportsCar extends Car {
  constructor(make, model, year, color, topSpeed) {
    super(make, model, year, color);
    this.topSpeed = topSpeed;
  }

  display() {
    super.display(); 
    console.log(`The top speed of the sports car is ${this.topSpeed} km/h.`);
  }
}


const mySportsCar = new SportsCar( "Ferrari", "488 GTB", 2022, "Red", 330);

mySportsCar.display();