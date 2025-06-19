function log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    let originalMethod = descriptor.value;

    descriptor.value = function(...args: any[]) {
        console.log(`${propertyKey} method called`);
        return originalMethod.apply(this, args);
    }
}

class Calculator {
    @log
    add(a: number, b: number): number {
        return a + b;
    }
}