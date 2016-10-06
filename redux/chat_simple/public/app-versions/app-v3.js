/* eslint-disable no-console */
/* eslint-disable no-shadow */

function createStore(reducer, initialState) {
  let state = initialState;
  // leanpub-start-insert
  const listeners = [];
  // leanpub-end-insert
  // ...

  // ...
  const subscribe = (listener) => (
    listeners.push(listener)
  );
  // ...

  const getState = () => (state);

  // ...
  const dispatch = (action) => {
    state = reducer(state, action);
    // leanpub-start-insert
    listeners.forEach(l => l());
    // leanpub-end-insert
  };
  // ...

  // ...
  return {
    // leanpub-start-insert
    subscribe,
    // leanpub-end-insert
    getState,
    dispatch,
  };
}

function reducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    return {
      messages: state.messages.concat(action.message),
    };
  } else if (action.type === 'DELETE_MESSAGE') {
    return {
      messages: [
        ...state.messages.slice(0, action.index),
        ...state.messages.slice(
          action.index + 1, state.messages.length
        ),
      ],
    };
  } else {
    return state;
  }
}

const initialState = { messages: [] };

const store = createStore(reducer, initialState);

const listener = () => (
  console.log(store.getState())
);

store.subscribe(listener);

const addMessageAction1 = {
  type: 'ADD_MESSAGE',
  message: 'How do you read?',
};
store.dispatch(addMessageAction1);
    // -> `listener()` is called

const addMessageAction2 = {
  type: 'ADD_MESSAGE',
  message: 'I read you loud and clear, Houston.',
};
store.dispatch(addMessageAction2);
    // -> `listener()` is called

const deleteMessageAction = {
  type: 'DELETE_MESSAGE',
  index: 0,
};
store.dispatch(deleteMessageAction);
    // -> `listener()` is called
