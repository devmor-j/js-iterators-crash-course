// The Generator object is returned by a generator function
// and it conforms to both the iterable protocol
// and the iterator protocol.

function* loopCounterGenerator(loopSize, maxIteration = loopSize * 2) {
  let counter = 0;
  let iteration = 0;

  while (true) {
    yield counter % loopSize;
    counter++;
    iteration++;
    if (iteration >= maxIteration) return counter;
  }
}

const loopCounter = loopCounterGenerator(3);

// for (const c of loopCounter) {
//   console.log(c);
// }
