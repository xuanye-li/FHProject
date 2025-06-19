function updateProperty<T>(obj: T, key: keyof T, value: any): T {
    obj[key] = value;
    return obj;
}
console.log(updateProperty({name: "Alice", age: 28}, "name", "Bob"));