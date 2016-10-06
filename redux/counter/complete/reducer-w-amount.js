/* eslint-disable no-console */

function reducer(state, action) {
  if (action.type === 'INCREMENT') {
    // leanpub-start-insert
    return state + action.amount;
    // leanpub-end-insert
  } else if (action.type === 'DECREMENT') {
    // leanpub-start-insert
    return state - action.amount;
    // leanpub-end-insert
  } else {
    return state;
  }
}

const incrementAction = {
  type: 'INCREMENT',
  amount: 5,
};

console.log(reducer(0, incrementAction)); // -> 5
console.log(reducer(1, incrementAction)); // -> 6

const decrementAction = {
  type: 'DECREMENT',
  amount: 11,
};

console.log(reducer(100, decrementAction)); // -> 89
