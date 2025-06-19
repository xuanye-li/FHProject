const books = {
    "TypeScript Basics": "T. Author",
    "Advanced TypeScript": "A. Expert",
    "TypeScript Projects": "P. Builder"
};

for (let title in books) {
    console.log(title, "-", books[title])
}