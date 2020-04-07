import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Chat } from 'react-chat-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom'

import CreatePost from "./components/create-post.component";
import CreateLogin from "./components/create-login.component";

import HomePage from "./components/HomePage.component";
import ProfilePage from "./components/ProfilePage.component";
import CreateAccount from "./components/create-account.component";

import logo from "./logo.svg";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="#" target="_blank">
              <img src={logo} width="30" height="30" alt="Our Logo" />
            </a>
            <Link to="/" className="navbar-brand">MERN-Stack Social Media Site</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/profile" className="nav-link">Profile</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Post</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br />
        
          <Route path="/" exact component={HomePage} />
          <Route path="/Profile" exact component={ProfilePage} />
          <Route path="/create" component={CreatePost} />
          <Route path="/login" component={CreateLogin} />
          <Route path="/createAccount" component={CreateAccount} />
          
          <Chat
            handleNewUserMessage={this.handleNewUserMessage}
          />
        </div>
      </Router>
    );
  }
}

export default App;
