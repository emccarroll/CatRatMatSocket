import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import { Chat } from 'react-chat-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import ReactDOM from 'react-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'

import { faHeart, faComment } from '@fortawesome/free-solid-svg-icons'




import CreateTodo from "./components/create-todo.component";
import CreateLogin from "./components/create-login.component";
import EditTodo from "./components/edit-todo.component";
import TodosList from "./components/todos-list.component";
import HomePage from "./components/HomePage.component";
import CreateAccount from "./components/create-account.component";

import logo from "./logo.svg";

library.add(faHeart, faComment)
class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <a class="navbar-brand" href="https://codingthesmartway.com" target="_blank">
              <img src={logo} width="30" height="30" alt="CodingTheSmartWay.com" />
            </a>
            <Link to="/" className="navbar-brand">MERN-Stack Todo App</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav mr-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/Profile" className="nav-link">Profile</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Todo</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/login" className="nav-link">Login</Link>
                </li>
              </ul>
            </div>
          </nav>
          <br />
          {/*<Route path="/" exact component={TodosList} />*/}
          <Route path="/" exact component={HomePage} />
          <Route path="/edit/:id" component={EditTodo} />
          <Route path="/create" component={CreateTodo} />
          <Route path="/login" component={CreateLogin} />
          <Route path="/createAccount" component={CreateAccount} />
          <h2>MERN-Stack Todo App</h2>
          <Chat
            handleNewUserMessage={this.handleNewUserMessage}
          />
        </div>
      </Router>
    );
  }
}

export default App;
