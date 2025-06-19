function processValue(value: number | string): number {
    if (typeof value === 'number') {
        return value * value;
    } else {
        return value.length;
    }
}

console.log(processValue(4));
console.log(processValue("hello"));