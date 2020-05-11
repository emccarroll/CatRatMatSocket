import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, useLocation } from "react-router-dom";

import { Chat } from 'react-chat-popup';
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import ReactDOM from 'react-dom'
import DirectMessaging from "./components/directmessaging/DirectMessaging"
import CreatePost from "./components/create-post.component";
import CreateLogin from "./components/create-login.component";

import openSocket from 'socket.io-client';
import HomePage from "./components/HomePage.component";
import ProfilePage from "./components/ProfilePage.component";
import CreateAccount from "./components/create-account.component";
import PostPage from "./components/postPage.component";
import LogoutPage from "./components/logoutPage.component";
import logo from "./logo.svg";
import * as Constants from "./Constants.js"

const socket = openSocket(Constants.config.url["API_URL"]+'/',{transports: ['websocket']});

class App extends Component {



  constructor(props) {
    super(props);
    this.state = {
      data:"",
      isLoggedIn:false
    };

    // This binding is necessary to make `this` work in the callback
    this.sendSocketIO = this.sendSocketIO.bind(this);
    this.apples= this.apples.bind(this);
    this.SuccesfullLoginCallback= this.SuccesfullLoginCallback.bind(this);
    this.SuccesfullLogoutCallback= this.SuccesfullLogoutCallback.bind(this);
    
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
this.checkIfLoggedIn();
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

checkIfLoggedIn(){
  fetch(
    Constants.config.url["API_URL"]+"/users/whoamI",
      {
        method: "get",
        credentials: 'include'
      }
    )
      .then((res) => res.json())
      .then((result) => {
        if(result.status==="Success"){
          console.log(result);
          this.setState(state => ({
              loading:false,
              isLoggedIn:true
              
            }));

            
          
        }
        else{
          
        }
          
        
      })
      .catch((error) => {alert("Error getting Posts", error); alert(error)});
}

SuccesfullLoginCallback(){
  this.setState({
    isLoggedIn:true
  })
}
SuccesfullLogoutCallback(){
  this.setState({
    isLoggedIn:false
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
            <Link to="/" className="navbar-brand">CatRatMatSocket</Link>
            <div className="collpase navbar-collapse">
              <ul className="navbar-nav ml-auto">
                <li className="navbar-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
                <li className="navbar-item">
                  <Link to={"/profile/"+sessionStorage.getItem("username")} className="nav-link">Profile</Link>
                </li>
                <li className="navbar-item">
                  <Link to="/create" className="nav-link">Create Post</Link>
                </li>
                <li className="navbar-item">
                  {this.state.isLoggedIn ? <Link to="/logout" className="nav-link">Logout</Link> :
                    <Link to="/login" className="nav-link">Login</Link>
                  }
                </li>

                {this.state.isLoggedIn ? <div className="navbar-item nav-link navbar-right" style={{float:"right"}}>Welcome, {sessionStorage.getItem("username")}</div> : <div></div>}
              </ul>
            </div>
          </nav>
          <br />
        
          <Route path="/" exact >
                <HomePage socketHandler={this.socketUpdateHandler}  dataFromParent={this.state.data} ></HomePage>
            </Route> 
          <Route path="/Profile/:profileUsername" exact  render={
              (props) => <ProfilePage  {...props} socketHandler={this.socketUpdateHandler} dataFromParent={this.state.data} ></ProfilePage>
          }
                 >
            </Route> 
          <Route path="/create" >
                <CreatePost socketHandler={this.socketUpdateHandler} ></CreatePost>
            </Route> 
          <Route path="/login">
                <CreateLogin socketHandler={this.socketUpdateHandler} SuccesfullLoginCallback={this.SuccesfullLoginCallback} ></CreateLogin>
            </Route> 
            <Route path="/logout">
                <LogoutPage socketHandler={this.socketUpdateHandler} SuccesfullLogoutCallback={this.SuccesfullLogoutCallback} ></LogoutPage>
            </Route> 
          <Route path="/createAccount" >
                <CreateAccount socketHandler={this.socketUpdateHandler} ></CreateAccount>
            </Route> 
          <Route path="/post/:postId" render={(props) => <PostPage {...props} socketHandler={this.socketUpdateHandler}  dataFromParent={this.state.data}></PostPage>} >
                
            </Route> 
            {this.state.isLoggedIn ? <DirectMessaging/> :<div/>}
          

          {/* <Chat
            handleNewUserMessage={this.handleNewUserMessage}
          /> */}
        </div>
      </Router>
    );
  }
}

export default App;
