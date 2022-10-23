// more info about Iteration Protocol
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol

// Arrays are iterable by default
const someArray = [1, "second", { order: 3 }, () => console.log("4")];

// for (const i of someArray) {
//   console.log(i);
// }

// --------------------------------------------------------

// Objects can be iterable if have an `[Sybmol.iterator]` property
const loadingDots = {
  [Symbol.iterator]() {
    const dots = [".  ", ".. ", "...", " ..", "  ."];
    let dotsIndex = -1;
    let stillLoading = true;

    setTimeout(() => {
      stillLoading = false;
    }, 2000 + Math.random() * 4000);

    return {
      next() {
        dotsIndex++;

        if (dotsIndex > dots.length - 1) {
          dotsIndex = 0;
        }

        return {
          value: stillLoading ? dots[dotsIndex] : "finished loading!",
          done: !stillLoading,
        };
      },
    };
  },
};

const loading = loadingDots[Symbol.iterator]();

// const loadingInterval = setInterval(() => {
//   const { value, done } = loading.next();

//   if (done) {
//     clearInterval(loadingInterval);
//   }

//   console.log(value);
// }, 500);

// we can simulate some fake api delay

const fakeAPIDelay = (duration = 300) =>
  new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, duration);
  });

// (async () => {
//   for (const loadingDot of loadingDots) {
//     await fakeAPIDelay(); // simple wait time
//     console.log(loadingDot);
//   }
//   console.log("Finished!");
// })();

// --------------------------------------------------------

// Functions can be iterable if return an
// object with an `next` function that returns
// another object with `value` and `done` properties

// some simple function that implements Iterable Protocol
function squared(max) {
  let n = 0;

  return {
    [Symbol.iterator]: () => ({
      next() {
        n++;

        return {
          value: n > max ? undefined : n ** 2,
          done: n > max,
        };
      },
    }),
  };
}

const squaredIt = squared(5);

// for (const i of squaredIt) {
//   console.log(i);
// }

// --------------------------------------------------------

const createHumanIterator = (age = 0, lifespan = 75) => {
  const that = {
    age,
    growUp(years = 1) {
      that.age += years;
    },
    [Symbol.asyncIterator]: () => ({
      next() {
        that.growUp();

        return Promise.resolve({
          value: that.age,
          done: that.age > lifespan,
        });
      },
    }),
  };

  return that;
};

const personIt = createHumanIterator(0, 11);

// (async () => {
//   for await (const person of personIt) {
//     console.log(person);
//   }
// })();

// --------------------------------------------------------

// iterators are also supported in es6 classes

class NumbersList {
  constructor() {
    this.numbers = Array.from(Array(10), (v, i) => (i + 1) * 10);
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

// for (const n of numbersListIt) {
//   console.log(n);
// }

// ---------------------------------------

// Iterators can run asynchronously

const dogs = async (totalDogs = 3) => {
  const apiPath = "https://dog.ceo/api/breeds/image/random";
  const axios = require("axios");

  return {
    [Symbol.asyncIterator]: () => {
      let dogIndex = 0;
      return {
        next: async () => {
          dogIndex++;
          const dogLink = (await axios.get(apiPath)).data.message;
          return Promise.resolve({
            value: dogIndex > totalDogs ? undefined : dogLink,
            done: dogIndex > totalDogs,
          });
        },
      };
    },
  };
};

// (async () => {
//   const dogsIt = await dogs();
//   for await (const dog of dogsIt) {
//     console.log(dog);
//   }
// })();
