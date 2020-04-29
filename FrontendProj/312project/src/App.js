import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, useLocation } from "react-router-dom";

import { Chat } from 'react-chat-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ReactDOM from 'react-dom'

import CreatePost from "./components/create-post.component";
import CreateLogin from "./components/create-login.component";

import openSocket from 'socket.io-client';
import HomePage from "./components/HomePage.component";
import ProfilePage from "./components/ProfilePage.component";
import CreateAccount from "./components/create-account.component";
import PostPage from "./components/postPage.component";
import logo from "./logo.svg";
import * as Constants from "./Constants.js"

const socket = openSocket(Constants.config.url["API_URL"]+'/',{transports: ['websocket']});

class App extends Component {



  constructor(props) {
    super(props);
    this.state = {
      data:""
    };

    // This binding is necessary to make `this` work in the callback
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.apples= this.apples.bind(this);
    this.SuccesfullLoginCallback= this.SuccesfullLoginCallback.bind(this);
    
    socket.on('update', this.apples)
  }

  socketUpdateHandler=(a)=>{
    this.sendSocketIO(a);
  }
  
apples(msg){
  console.log(msg);
  this.setState(state => ({
    data:msg
  }))
}

componentDidMount(){
//this.sendSocketIO("waddup");
this.onRouteChanged();
}

sendSocketIO(s) {
  if(s==="homepage"){
    console.log("yo we sending without the listento")
    socket.emit(s);
  }
  else{
    socket.emit('listenTo', s);
  }
  
}

SuccesfullLoginCallback(){
  this.setState({
    successfullLogin:true
  })
}


componentDidUpdate(prevProps, prevState) {
  console.log("route dh");
this.onRouteChanged();
}
onRouteChanged() {
  console.log("ROUTE CHANGED");
}


  render() {
    //this.sendSocketIO("FirstField","waddup");
    return (
      <Router >
        <div className="container MainContainerBG">
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
                {this.state.successfullLogin ? <div className="navbar-item nav-link">You're Logged in</div> : <div></div>}
              </ul>
            </div>
          </nav>
          <br />
        
          <Route path="/" exact >
                <HomePage socketHandler={this.socketUpdateHandler}  dataFromParent={this.state.data} ></HomePage>
            </Route> 
          <Route path="/Profile" exact  >
                <ProfilePage socketHandler={this.socketUpdateHandler} ></ProfilePage>
            </Route> 
          <Route path="/create" >
                <CreatePost socketHandler={this.socketUpdateHandler} ></CreatePost>
            </Route> 
          <Route path="/login">
                <CreateLogin socketHandler={this.socketUpdateHandler} SuccesfullLoginCallback={this.SuccesfullLoginCallback} ></CreateLogin>
            </Route> 
          <Route path="/createAccount" >
                <CreateAccount socketHandler={this.socketUpdateHandler} ></CreateAccount>
            </Route> 
          <Route path="/post/:postId" render={(props) => <PostPage {...props} socketHandler={this.socketUpdateHandler}  dataFromParent={this.state.data}></PostPage>} >
                
            </Route> 
          
          <Chat
            handleNewUserMessage={this.handleNewUserMessage}
          />
        </div>
      </Router>
    );
  }
}

export default App;
