import React, { Component } from "react";
import { Chat } from 'react-chat-popup';
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  render() {
    return (
      
        <div className="container">
          <h2>MERN-Stack Todo App</h2>
          <Chat
            handleNewUserMessage={this.handleNewUserMessage}
          />
        </div>
      
    );
  }
}

export default App;
