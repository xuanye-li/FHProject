function wrapInArray<T>(value: T): T[] {
    return [value];
}

console.log(wrapInArray(42));