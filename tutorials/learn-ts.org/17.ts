interface MyDictionary {
    [index: string]: string | number;
}

function getValueFromDict(key: string, dict: MyDictionary): string | number | undefined {
    return dict[key];
}

const dict = { name: "Alice", age: 30 };
console.log(getValueFromDict("name", dict));