enum Days {Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday}

function classifyDay(day: Days): string {
    switch (day) {
        case Days.Sunday:
        case Days.Saturday:
            return "Weekend";
        default:
            return "Weekday";
    }
}

console.log(classifyDay(Days.Monday));
console.log(classifyDay(Days.Saturday));