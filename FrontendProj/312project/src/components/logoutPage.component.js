import React, { Component } from 'react';
import * as Constants from "../Constants.js";
import {Redirect, useParams} from 'react-router-dom';
export default class LogoutPage extends Component {

    constructor(props) {
        super(props);
        this.state = {isLoggedOut: false};
        
    
        

        // This binding is necessary to make `this` work in the callback
        this.goLogout=this.goLogout.bind(this);
      }
    componentDidMount(){
        this.goLogout();
    }

    goLogout(){
        fetch(
            Constants.config.url["API_URL"]+"/users/logout",
              {
                method: "get",
                credentials: 'include'
              }
            )
              .then((res) => res.json())
              .then((result) => {
                if(result.status==="Success"){
                  console.log(result);
                  this.props.SuccesfullLogoutCallback();
                  this.setState({isLoggedOut:true})
                    
                  
                }
                else{
                    this.setState({goToLoginPage:true})
                }
                  
                
              })
              .catch((error) => {alert("Error getting Posts", error); alert(error)});
    }
      render() {
          if(this.state.isLoggedOut){
              return(<Redirect push to={"/"} />)
          }
          else if(this.state.goToLoginPage){
            return(<Redirect push to={"/login"} />)
            }
          else{
              return(<div>Loading</div>)
          }

      }
}

