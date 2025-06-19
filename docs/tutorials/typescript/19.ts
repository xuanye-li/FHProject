interface Circle {
    kind: "circle";
    radius: number;
}

interface Square {
    kind: "square";
    sideLength: number;
}

type Shape = Circle | Square;

function calculateArea(shape: Shape): number {
    // Your code here
    let area: number = 0;
    switch (shape.kind) {
        case "circle":
            // here shape is of type Circle
            area = Math.PI * shape.radius ** 2;
            break;
        case "square":
            // here shape is of type Square
            area = shape.sideLength ** 2;
            break;
     
    }
     return area;
}

console.log(calculateArea({kind: "circle", radius: 2}))
console.log(calculateArea({kind: "square", sideLength: 3}))