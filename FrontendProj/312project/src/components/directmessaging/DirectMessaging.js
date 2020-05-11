import React, { Component } from "react";
import * as Constants from "../../Constants.js";
import ChatWindow from "./ChatWindow"
import "./dmStyles.css"

export default class DirectMessaging extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:"",
          showModal:false
        };
    }
    toggleModal(){
        this.setState({
            showModal:!this.state.showModal
        })
    }


    render(){
        


        return(
            <div>
                {this.state.showModal ? <ChatWindow></ChatWindow> :<div></div>}
                <div className="FloatingActionButton" onClick={(e)=>this.toggleModal()}><h2 className="FabText">Dm's</h2></div>
            </div>
            
        )




    }


}