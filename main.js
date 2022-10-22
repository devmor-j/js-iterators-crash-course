// more info about Iteration Protocol
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol

function logForOf(iterable) {
  for (let i of iterable) {
    console.log(i);
  }
}

async function logForAwaitOf(asyncIterable) {
  for await (let i of asyncIterable) {
    console.log(i);
  }
}

// Arrays are iterable by default
const someArray = [1, "second", { order: 3 }, () => console.log("4")];

// logForOf(someArray);

// ---------------------------------------------------

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

// ------------------------------------------

// Functions can be iterable if returns an
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

const squaredIt = squared(4);

// logForOf(squaredIt);

// -----------------------------------------------------

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
          value: { ...that },
          done: that.age > lifespan,
        });
      },
    }),
  };

  return that;
};

const personIt = createHumanIterator(7, 11);

// (async () => {
//   await logForAwaitOf(personIt);
// })();

// ----------------------------------

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

// Iterators can run asyncronously

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
//   await logForAwaitOf(dogsIt);
// })();
