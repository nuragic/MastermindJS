const PEGS_PER_ROW = 4;

// Stateless PRIVATE functions used by the game:
function generateSecret(colors) {
  const max = colors.length;
  let s = [];

  for (let i = 0; i < PEGS_PER_ROW; i += 1) {
    const randomIndex = Math.floor(Math.random() * max);
    s[i] = colors[randomIndex];
  }

  return s.reverse();
};

function getHints(combination, secret) {
  // create a local copy of both combinations
  const secretCombination = [...secret];
  const userCombination = [...combination];
  // initialize hints counters
  let black = 0;
  let white = 0;

  // check for pegs on correct position (black pegs)
  for (let i = 0; i < PEGS_PER_ROW; i += 1) {
    // if it's the same type (and same position cause they have the same index)
    if (userCombination[i] === secretCombination[i]) {
      // mark as checked
      secretCombination[i] = userCombination[i] = null;
      // increment black pegs
      black += 1;
    }
  }
  // check for colors in wrong positions (white pegs)
  for (let i = 0; i < PEGS_PER_ROW; i += 1) {
    for (let x = 0; x < PEGS_PER_ROW; x += 1) {
      // if not already checked
      if(userCombination[i] && secretCombination[x]) {
        // if it's the same type (but different positions cause the index doesn't match)
        if (userCombination[i] === secretCombination[x]) {
          // mark as checked
          secretCombination[x] = userCombination[i] = null;
          // increment white pegs
          white += 1;
        }
      }
    }
  }

  return { black, white };
};

// Stateful PUBLIC function that implements the game itself
function Mastermind() {

  const colors = ['yellow', 'orange', 'red', 'green', 'blue', 'purple', 'pink', 'brown', 'black', 'white'];

  const levels = {
    easy:   { attempts: 10, colors: colors.slice(0, 6) },
    medium: { attempts: 8,  colors: colors.slice(0, 8) },
    hard:   { attempts: 6,  colors: colors.slice()     },
    god:    { attempts: 1,  colors: colors.slice()     }
  };

  const defaultLevel = 'medium';

  let secret = [];

  let state = {
    level          : '',
    status         : '',
    currentAttempt : 0,
  };

  const startGame = (level = defaultLevel) => {
    const selectedLevel = levels[level];
    // generate the secret key passing the level's colors
    secret = generateSecret(selectedLevel.colors);
    // update the game state
    state.currentAttempt = 1;
    state.status = 'playing'
    state.level = selectedLevel;

    return { ...state };
  };

  const checkCombination = (combination) => {
    const hints = getHints(combination, secret);
    state.status = (hints.black === PEGS_PER_ROW) ? 'win' : ((state.level.attempts > state.currentAttempt) ? 'playing' : 'lose');
    state.currentAttempt += (state.status === 'playing') ? 1 : 0;
    return { ...state, hints, secret: (state.status === 'lose') && secret };
  };

  return {
    startGame,
    checkCombination,
    PEGS_PER_ROW,
  };

}

export default Mastermind.call({});
