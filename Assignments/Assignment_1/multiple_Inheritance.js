// Multiple Inheritance

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

// Mixin: MusicSystem functionality
const MusicMixin = (BaseClass) => {
  return class extends BaseClass {
    
    // Method added by the Mixin
    playMusic() {
      console.log("The car is playing music.");
    }
  };
};

// Derived class: Car extends Vehicle + MusicMixin
class Car extends MusicMixin(Vehicle) {
  constructor(make, model, year, color) {
    super(make, model, year);
    this.color = color;
  }

  // Method to display car information
  display() {
    super.display(); 
    console.log(`The car is in ${this.color} color.`);
  }
}

// object of Car
const myCar = new Car("Toyota", "Corolla", 2021, "Blue");

// Methods from Vehicle
myCar.display();

// Method from MusicMixin
myCar.playMusic();