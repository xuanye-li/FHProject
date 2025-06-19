abstract class Shape {
    abstract area(): number;
}

class Circle extends Shape {
    constructor(public radius: number) {
        super();
    }

    area(): number {
        return Math.PI * this.radius * this.radius;
    }
}

class Rectangle extends Shape {
    constructor(public width: number, public height: number) {
        super();
    }

    area(): number {
        return this.width * this.height;
    }
}

const myCircle: Circle = new Circle(5);
const myRect: Rectangle = new Rectangle(4, 7);

console.log(myCircle.area());
console.log(myRect.area());