// The Generator object is returned by a generator function
// and it conforms to both the iterable protocol
// and the iterator protocol

// iterable protocol refers to [Symbol.iterator]
// iterator protocol refers to { next() {} }

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

// --------------------------------------------------------

// you can call another generator function using yield*
// In other words yield* expression is used to delegate to
// another generator or iterable object

function* gen1() {
  yield 2;
  yield 3;
}

function* gen2() {
  yield 1;
  yield* gen1();
  yield 4;
}

// for (const i of gen2()) {
//   console.log(i); // 1, 2, 3, 4
// }

// --------------------------------------------------------

// Example: Fight Club Game

const GameDifficulty = {
  EASY: 0.25,
  NORMAL: 0.5,
  HARD: 0.75,
};

function fakeDelay(duration = 300) {
  return new Promise((res) => {
    setTimeout(() => {
      res(true);
    }, duration);
  });
}

function randomBoolean(truthChance = 0.5) {
  return Math.random() < truthChance ? false : true;
}

function attack({ strength = 0.5 } = {}) {
  return Math.round(10 + Math.random() * 40 * strength);
}

async function* fightClubGenerator({ difficulty }) {
  let playerHealth = 75 + (1 - difficulty) * 100;
  let enemyHealth = 125 - (1 - difficulty) * 100;

  console.log("\nFIGHT!\n");
  console.log(`You 🧡 ${playerHealth} --- Enemy 💙 ${enemyHealth}`);

  while (playerHealth > 0 && enemyHealth > 0) {
    await fakeDelay(300 + Math.random() * 600);

    const isPlayerHit = randomBoolean(difficulty);

    if (isPlayerHit) {
      playerHealth -= attack({ strength: difficulty });
    } else {
      enemyHealth -= attack({ strength: 1 - difficulty });
    }

    if (playerHealth <= 0) {
      yield "Game Over! 💀";
      return;
    } else if (enemyHealth <= 0) {
      yield "You Won! 🌟⚔🌟";
      return;
    }

    yield `You 🧡 ${playerHealth} --- Enemy 💙 ${enemyHealth}`;
  }
}

const playGame = async () => {
  const fightClub = fightClubGenerator({ difficulty: GameDifficulty.NORMAL });

  for await (const fight of fightClub) {
    console.log(fight);
  }
};

// playGame();
