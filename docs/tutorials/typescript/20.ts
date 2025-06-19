type Point = {
    x: number;
    y: number;
};

// Your mapped type definition here

type NullablePoint = {
    [P in keyof Point]?: Point[P] | null;
};

let nullablePoint: NullablePoint = {
    x: null,
    y: 5
};

console.log(nullablePoint.x);
console.log(nullablePoint.y);