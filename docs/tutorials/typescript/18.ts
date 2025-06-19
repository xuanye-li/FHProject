function sortOrderMessage(order: "ascending" | "descending"): string {
    if (order === "ascending") {
        return "The order is set to ascending.";
    } else {
        return "The order is set to descending.";
    }
}

console.log(sortOrderMessage("ascending"));
console.log(sortOrderMessage("descending"));