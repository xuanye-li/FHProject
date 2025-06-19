type Rectangle = {
    // Your code to define the properties
    width: number;
    height: number;
};

function computeArea(rect: Rectangle): number {
    // Your code to compute the area
    return rect.width * rect.height;
}

console.log(computeArea({ width: 10, height: 5 }));