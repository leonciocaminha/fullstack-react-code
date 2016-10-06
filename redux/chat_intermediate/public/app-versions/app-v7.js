/* eslint-disable no-undef */ /* eslint-disable no-shadow */

function reducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4(),
    };
    const threadIndex = state.threads.findIndex(
      (t) => t.id === action.threadId
    );
    const oldThread = state.threads[threadIndex];
    const newThread = {
      ...oldThread,
      messages: oldThread.messages.concat(newMessage),
    };

    return {
      ...state,
      threads: [
        ...state.threads.slice(0, threadIndex),
        newThread,
        ...state.threads.slice(
          threadIndex + 1, state.threads.length
        ),
      ],
    };
  } else if (action.type === 'DELETE_MESSAGE') {
    const threadIndex = state.threads.findIndex(
      (t) => t.messages.find((m) => (
        m.id === action.id
      ))
    );
    const oldThread = state.threads[threadIndex];
    const messageIndex = oldThread.messages.findIndex(
      (m) => m.id === action.id
    );
    const messages = [
      ...oldThread.messages.slice(0, messageIndex),
      ...oldThread.messages.slice(
        messageIndex + 1, oldThread.messages.length
      ),
    ];
    const newThread = {
      ...oldThread,
      messages: messages,
    };

    return {
      ...state,
      threads: [
        ...state.threads.slice(0, threadIndex),
        newThread,
        ...state.threads.slice(
          threadIndex + 1, state.threads.length
        ),
      ],
    };
  } else {
    return state;
  }
}

const initialState = {
  activeThreadId: '1-fca2',
  threads: [
    {
      id: '1-fca2',
      title: 'Buzz Aldrin',
      messages: [
        {
          text: 'Twelve minutes to ignition.',
          timestamp: Date.now(),
          id: uuid.v4(),
        },
      ],
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: [],
    },
  ],
};

const store = Redux.createStore(reducer, initialState);

const App = React.createClass({
  componentDidMount: function () {
    store.subscribe(() => this.forceUpdate());
  },
  render: function () {
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const threads = state.threads;
    const activeThread = threads.find((t) => t.id === activeThreadId);

    const tabs = threads.map(t => (
      {
        title: t.title,
        active: t.id === activeThreadId,
      }
    ));

    return (
      <div className='ui segment'>
        <ThreadTabs tabs={tabs} />
        <Thread thread={activeThread} />
      </div>
    );
  },
});

/* eslint-disable react/prefer-stateless-function */

const ThreadTabs = React.createClass({
  render: function () {
    const tabs = this.props.tabs.map((tab, index) => (
      <div
        key={index}
        className={tab.active ? 'active item' : 'item'}
      >
        {tab.title}
      </div>
    ));
    return (
      <div className='ui top attached tabular menu'>
        {tabs}
      </div>
    );
  },
});

const MessageInput = React.createClass({
  handleSubmit: function () {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.refs.messageInput.value,
      threadId: this.props.threadId,
    });
    this.refs.messageInput.value = '';
  },
  render: function () {
    return (
      <div className='ui input'>
        <input
          ref='messageInput'
          type='text'
        >
        </input>
        <button
          onClick={this.handleSubmit}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
      </div>
    );
  },
});

const Thread = React.createClass({
  handleClick: function (id) {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      id: id,
    });
  },
  render: function () {
    const messages = this.props.thread.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(message.id)}
      >
        <div className='text'>
          {message.text}
          <span className='metadata'>@{message.timestamp}</span>
        </div>
      </div>
    ));
    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput threadId={this.props.thread.id} />
      </div>
    );
  },
});

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
