namespace Geometry {
    export function areaOfRectangle(width: number, height: number): number {
        return width * height;
    }

    export function areaOfCircle(radius: number): number {
        return Math.PI * radius * radius;
    }
}

console.log(Geometry.areaOfRectangle(10, 5));
console.log(Geometry.areaOfCircle(7));