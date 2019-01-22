import React from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from '../components/MessageList'
import SendMessageForm from '../components/SendMessageForm'
import TypingIndicator from '../components/TypingIndicator'
import Online from '../components/Online'

class ChatScreen extends React.Component {
    constructor(props) {
    super(props)
        this.state = {
            currentUser: {},
            currentRoom: {},
            messages: [],
            usersTyping: []
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.sendTypingEvent = this.sendTypingEvent.bind(this)
    }

sendTypingEvent() {
    this.state.currentUser
        .isTypingIn({ roomId: this.state.currentRoom.id })
        .catch(error => console.error('error', error))
    }

sendMessage(text) {
    this.state.currentUser.sendMessage({
        text,
        roomId: this.state.currentRoom.id
    })
}

componentDidMount () {
const chatManager = new Chatkit.ChatManager({
instanceLocator: "v1:us1:51397e4a-e6de-4332-ae5a-a86ec3161308",
userId: this.props.currentUsername,
tokenProvider: new Chatkit.TokenProvider({
    url: 'http://localhost:3001/authenticate',
}),
})

chatManager
    .connect()
    .then(currentUser => {
        this.setState({ currentUser })
        return currentUser.subscribeToRoom({
            roomId: "19378019",
            messageLimit: 100,
            hooks: {
                onMessage: message => {
                    this.setState({
                        messages: [...this.state.messages, message]
                    })
                },
                onUserStartedTyping: user => {
                    this.setState({
                        usersTyping: [...this.state.usersTyping, user.name],
                    })
                },
                onUserStoppedTyping: user => {
                    this.setState({
                        usersTyping: this.state.usersTyping.filter(username => username !== user.name),
                    })
                },
                onPresenceChange: () => this.forceUpdate(),
                onUserJoined: () => this.forceUpdate()
            },
        })
    })
    .then(currentRoom => {
        this.setState({currentRoom})
    })
    .catch(error => console.error('error', error))
}

render() {
    const styles = {
        container: {
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
        },
        chatContainer: {
            display: 'flex',
            flex: 1,
        },
        whosOnlineListContainer: {
            width: '300px',
            flex: 'none',
            padding: 20,
            backgroundColor: '#2c303b',
            color: 'white',
        },
        chatListContainer: {
            padding: 20,
            width: '85%',
            display: 'flex',
            flexDirection: 'column',
        }
    }
        
    return (
        <div style={styles.container}>
        <div style={styles.chatContainer}>
        <aside style={styles.whosOnlineListContainer}>
            <Online currentUser={this.state.currentUser} users={this.state.currentRoom.users} />
        </aside>
        <section style={styles.chatListContainer}>
            <MessageList
                messages={this.state.messages}
                style={styles.chatList}
            />
            <TypingIndicator usersTyping={this.state.usersTyping} />
            <SendMessageForm onSubmit={this.sendMessage} onChange={this.sendTypingEvent} />
        </section>
        </div>
        </div>
    )
  }
}

export default ChatScreen;