let data: any = "Hello, TypeScript!";

function getStringLength(value: any): number {
    // Your code here
    return (value as string).length;
}

console.log(getStringLength(data));