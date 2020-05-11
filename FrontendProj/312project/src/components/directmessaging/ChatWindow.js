import React, { Component } from "react";
import * as Constants from "../../Constants.js";
import ListOfConversations from "./ListOfConversations"
import ConvoView from "./ConvoView"
import "./dmStyles.css"

export default class ChatWindow extends Component {
    constructor(props) {
        super(props);
        this.state = {
          data:"",
          showModal:false,
          messages:[],
          isLoading:true
        };
        this.goToChatView=this.goToChatView.bind(this);
    }
    componentDidMount(){
        this.getAllMessages()
    }
    toggleModal(){
        this.setState({
            showModal:!this.state.showModal
        })
    }
    filterMessages(messages){
        console.log(messages)
        var messagesDictionary= new Object();

        for(var i=0; i<messages.length;i++){
            var msgObj=messages[i]
            console.log("the user from this message is "+msgObj.user);
            if(messagesDictionary[msgObj.user]){
                messagesDictionary[msgObj.user].push(msgObj);
            }
            else{
                messagesDictionary[msgObj.user]= [msgObj];
            }
        }
        this.setState({
            isLoading:false,
            messageMap:messagesDictionary
        })



    }
    getAllMessages(){
        fetch(
            Constants.config.url["API_URL"]+"/chat/getMessages",
            {
              method: "get",
              credentials: "include"
              
            }
          )
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                if(result.Status==="success"){
                    this.setState({
                        messages:result.messages
                    })
                }
                this.filterMessages(result.messages);
              
            })
            .catch((error) => {alert("Error getting DMS", error); alert(error)});
    }
    goToChatView(username){
       this.setState({
           showChatView:true,
           openConvoWith:username
       })
    }
    OnPostDMButtonClicked(messageText){
        fetch(
            Constants.config.url["API_URL"]+"/chat/message",
            {
              method: "post",
              
              credentials: "include",
              
              headers: {
                'Content-Type': 'application/json'},
                
              body: JSON.stringify({
                "username": this.state.openConvoWith,
                "message": messageText
              })
            }
          )
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                if(result.Status==="success"){
                    
                }
                
              
            })
            .catch((error) => {alert("Error getting DMS", error); alert(error)});
    }



    render(){
        


        return(
            <div className="ChatWindow Container-fluid justify-content-center">
                <div className="row">
                    <div className="col-12 text-center ">
                        {/* <div className="nav nav-pills nav-fill width100" role="group" aria-label="Basic example">
                            <li type="button" className="nav-item nav-link active tab">Chat List</li>
                            <li type="button" className="nav-item nav-link active tab">Chat</li>

                        </div> */}
                        <div className="Container-fluid">
                            <div className="row">
                                <div className="col-2">

                                </div>
                                <div className="col-8">
                                <h4>Direct Messaging</h4>
                                </div>
                                <div className="col-2">

                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div className="row">
                    <div className="col-12">
                        {this.state.showChatView ? <ConvoView isLoading={this.state.isLoading} OnPostDMButtonClicked={this.OnPostDMButtonClicked} messages={this.state.messageMap[this.state.openConvoWith]}></ConvoView> : 
                        <ul className="list-group width100 overflow-auto">
                            <ListOfConversations isLoading={this.state.isLoading} conversations={this.state.messageMap} goToChatView={this.goToChatView} />
                        </ul>
                        }
                        
                    </div>
                    
                </div>
                
                
            </div>
            
        )




    }


}