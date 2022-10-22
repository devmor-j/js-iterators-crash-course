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

const squaredIt = squared(3);

for (let s of squaredIt) {
  // console.log(s);
}

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
      return() {
        return {
          done: true,
        };
      },
    }),
  };

  return that;
};

const personIt = createHumanIterator(7, 15);

(async () => {
  for await (const p of personIt) {
    console.log(p);
  }
})();
