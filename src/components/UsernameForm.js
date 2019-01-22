import React from 'react'

class UsernameForm extends React.Component {
 constructor(props) {
   super(props)
   this.state = {
     username: '',
   }
   this.handleSubmit = this.handleSubmit.bind(this)
   this.handleChange = this.handleChange.bind(this)
 }

 handleSubmit(e) {
   e.preventDefault()
   this.props.onSubmit(this.state.username)
 }

 handleChange(e) {
    this.setState({ username: e.target.value })
  }

  render() {
    return (
      <div className="div">
        <div>
          <h1 className="welcome">Chat App 1.0</h1>
          <h2 className="header2">Enter your username to start chatting</h2>
          <form className="usernameForm" onSubmit={this.handleSubmit}>
            <input
              className="username"
              type="text"
              placeholder="Username"
              onChange={this.handleChange}
            />
            <input className="send" type="submit" value="Send"/>
          </form>
        </div>
      </div>
    )
  }
}

export default UsernameForm