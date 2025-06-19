type Car = { type: "car", doors: number };
type Bike = { type: "bike", hasBell: boolean };

type Vehicle = Car | Bike;

function identifyVehicle(vehicle: Vehicle): string {
    // Your code here
    return vehicle.type;
}

console.log(identifyVehicle({ type: "bike", hasBell: true }));