class NumbersList {
  constructor() {
    this.numbers = [1, 2, 3];
  }

  [Symbol.iterator]() {
    const numbers = this.numbers;
    let currentIndex = -1;

    return {
      next() {
        return {
          value: numbers[++currentIndex],
          done: currentIndex >= numbers.length,
        };
      },
    };
  }
}

const numbersListIt = new NumbersList();

for (const n of numbersListIt) {
  console.log(n);
}
