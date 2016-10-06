import React, { PropTypes } from 'react'
import {pick} from 'lodash'
import 'font-awesome/css/font-awesome.css';
import moment from 'moment'
const styles = require('./Messages.css');

const Messages = React.createClass({
  propTypes: {
    users: PropTypes.array.isRequired,
    initialActiveChatIdx: PropTypes.number,
    messages: PropTypes.array.isRequired
  },

  childContextTypes: {
    users: PropTypes.array,
    userMap: PropTypes.object
  },

  getDefaultProps: function() {
    return {
      initialActiveChatIdx: 0
    }
  },

  getChildContext: function() {
    return {
      users: this.getUsers(),
      userMap: this.getUserMap()
    }
  },

  getInitialState: function() {
    return {
      currentChatIndex: this.props.initialActiveChatIdx
    }
  },

  getUsers: function() {
    const users = this.props.users
            .map(m => pick(m, ['uuid', 'username', 'avatar', 'lastOnline']))
            .sort((a, b) => moment(a.lastOnline).isBefore(b.lastOnline))
    return users;
  },

  getUserMap: function() {
    // Should be elsewhere
    return this.props.users.reduce((memo, u) => {
      memo[u.uuid] = u;
      return memo;
    }, {});
  },

  selectChat: function(idx) {
    this.setState({
      currentChatIndex: idx
    })
  },

  render: function() {
    const {currentChatIndex} = this.state;
    const currentChat = this.props.messages[currentChatIndex];
    return (
      <div className={styles.container}>
        {/* navbar */}
        <ThreadList onClick={this.selectChat} />
        <ChatWindow messages={currentChat} />
      </div>
    )
  }
});

export default Messages

///// For demo purposes
const ThreadList = React.createClass({
  contextTypes: {
    users: PropTypes.array,
  },

  render: function() {
    return (
      <div className={styles.threadList}>
        <ul className={styles.list}>
          {this.context.users.map((u, idx) => {
            return (<UserListing onClick={this.props.onClick}
                                   key={idx}
                                   index={idx}
                                   user={u} />)
          })}
      </ul>
        </div>
    )
  }
})

const UserListing = React.createClass({
  propTypes: {
    onClick: PropTypes.func,
    index: PropTypes.number
  },

  contextTypes: {
    users: PropTypes.array
  },

  handleClick: function(e) {
    this.props.onClick(this.props.index);
  },

  render: function() {
    const {user} = this.props;
    const lastOnline = moment(user.lastOnline).fromNow();
    const onlineWindow = moment().subtract(2, 'hours')
    const online = moment(user.lastOnline).isAfter(onlineWindow)

    return (
      <li className={styles.userListing} onClick={this.handleClick}>
        <img src={user.avatar} className={styles.avatar} alt={user.username} />
        <div className={styles.about}>
          <div className={styles.name}>{user.username}</div>
          <div className={styles.status}>
            <i className={['fa', 'fa-circle', online ? styles.online : styles.offline].join(' ')}></i>
            {online ?
            'online' : lastOnline}
          </div>
        </div>
      </li>
    )
  }
})

const ChatWindow = React.createClass({
  propTypes: {
    messages: PropTypes.object
  },
  contextTypes: {
    userMap: PropTypes.object
  },
  getParticipants: function() {
    const {userMap} = this.context;
    const uuids = this.props.messages.thread
            .map(m => m.from)
            .filter(m => m !== 'me');

    const users = uuids.reduce((memo, uid) => {
      if (!memo.map[uid]) {
        memo.list.push(userMap[uid]);
        memo.map[uid] = true
      }
      return memo;
    }, {list: [], map: {}});
    return users.list;
  },
  render: function() {
    const participants = this.getParticipants();
    const {thread} = this.props.messages;
    return (
      <div className={styles.chat}>
        <ChatHeader participants={participants} />
        {thread.map((msg, index) => {
          return (
            <ChatMessage message={msg}
                         index={index}
                         key={index} />
          )
        })}
      </div>
    )
  }
})

const ChatHeader = (props, context) => {
  const user = props.participants[0]; // one user, for now
  return (
    <div className={[styles.chatHeader].join(' ')}>
      <img src={user.avatar} className={styles.avatar} alt={user.username} />

      <div className={styles.chatAbout}>
        <div className={styles.chatWith}>Chat with {user.username}</div>
      </div>
      <div />
    </div>
  )
}
ChatHeader.propTypes = {participants: PropTypes.array}
ChatHeader.contextTypes = {users: PropTypes.array}

const ChatMessage = React.createClass({
  propTypes: {
    message: PropTypes.object
  },

  contextTypes: {
    userMap: PropTypes.object
  },

  getMessageClass: function(other) {
    const {message} = this.props;
    let klasses = [styles.messageData]
    if (message.from !== 'me') {
      klasses.push(other)
    }
    return klasses;
  },

  render: function() {
    const {message} = this.props;
    const at = moment(message.sentAt).fromNow()

    let textKlasses = [styles.message];
    let messageKlasses = [styles.messageData];
    let datetimeKlasses = [styles.messageDataTime];
    let user = message.from;

    if (message.from === 'me') {
      user = {username: 'me'}
      messageKlasses = messageKlasses.concat([styles.alignRight])
      datetimeKlasses = datetimeKlasses.concat([styles.floatRight])
      textKlasses = textKlasses.concat([styles.myMessage, styles.floatRight])
    } else {
      user = this.context.userMap[user];
      messageKlasses = messageKlasses.concat([styles.alignLeft])
      datetimeKlasses = datetimeKlasses.concat([styles.floatLeft])
      textKlasses = textKlasses.concat([styles.otherMessage])
    }
    return (
      <div className={styles.message}>
        <div className={messageKlasses.join(' ')}>
          <span className={styles.messageDataName}>{user.username}</span>
        </div>
        <div className={textKlasses.join(' ')}>
          {message.text}
        </div>
        <div className={datetimeKlasses.join(' ')}>{at}</div>
      </div>
    )
  }
})
