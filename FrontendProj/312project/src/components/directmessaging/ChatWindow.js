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
          isLoading:true,
          onNewMessage:null,
          messageMap:null,
          username:""
        };
        this.goToChatView=this.goToChatView.bind(this);
        this.OnPostDMButtonClicked=this.OnPostDMButtonClicked.bind(this);
    }
    componentDidMount(){
        this.whoAmI();
        //this.getAllMessages();
    }
    toggleModal(){
        this.setState({
            showModal:!this.state.showModal
        })
    }

    componentDidUpdate(nextProps) {
        const { onNewMessage } = this.props;

        const {messageMap, messages}=this.state;
        if (nextProps.onNewMessage !== onNewMessage) {
            console.log("yea yea")


            if((nextProps.onNewMessage.fromUser===this.state.username)&&(nextProps.onNewMessage.toUser===this.state.username)){
                if(messageMap[nextProps.onNewMessage.fromUser]){
                    messageMap[nextProps.onNewMessage.fromUser].push(nextProps.onNewMessage);
                }
                else messageMap[nextProps.onNewMessage.fromUser]=[nextProps.onNewMessage];
            }
            else if((nextProps.onNewMessage.fromUser===this.state.username)&&(nextProps.onNewMessage.toUser!==this.state.username)){
                if(messageMap[nextProps.onNewMessage.toUser]){
                    messageMap[nextProps.onNewMessage.toUser].push(nextProps.onNewMessage);
                    console.log("yea man its me2")
                }
                else{
                    messageMap[nextProps.onNewMessage.toUser]=[nextProps.onNewMessage];
                }
                
            }
            else if((nextProps.onNewMessage.fromUser!==this.state.username)&&(nextProps.onNewMessage.toUser===this.state.username)){
                if(messageMap[nextProps.onNewMessage.fromUser]){
                    messageMap[nextProps.onNewMessage.fromUser].push(nextProps.onNewMessage);
                    console.log("yea man its me")
                }
                else messageMap[nextProps.onNewMessage.fromUser]=[nextProps.onNewMessage];
            }
            else{
                console.log((nextProps.onNewMessage.fromUser!==this.state.username))
                console.log((nextProps.onNewMessage.toUser===this.state.username))
                console.log(nextProps)
                console.log((nextProps.onNewMessage).toUser);
                console.log(this.state.username)
                console.log("non of the above dawg")
            }
            messages.push(onNewMessage);
            this.setState({
                messages:messages,
                messageMap:messageMap
            })
            




        }
       }

    whoAmI(){
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
                      username:result.username,
                      
                      
                    }));
                    this.getAllMessages();
                }
                
                  
                
              })
              .catch((error) => {alert("Error getting checking if logged in", error); alert(error)});
    }
    filterMessages(messages){
        console.log(messages)
        var messageMap= new Object();

        for(var i=0; i<messages.length;i++){
            var msgObj=messages[i]
            console.log("the user from this message is "+msgObj.user);
            
                if((msgObj.fromUser===this.state.username)&&(msgObj.toUser===this.state.username)){
                    if(messageMap[msgObj.fromUser]){
                        messageMap[msgObj.fromUser].push(msgObj);
                    }
                    else messageMap[msgObj.fromUser]=[msgObj];
                }
                else if((msgObj.fromUser===this.state.username)&&(msgObj.toUser!==this.state.username)){
                    if(messageMap[msgObj.toUser]){
                        messageMap[msgObj.toUser].push(msgObj);
                    }
                    else{
                        messageMap[msgObj.toUser]=[msgObj];
                    }
                    
                }
                else if((msgObj.fromUser!==this.state.username)&&(msgObj.toUser===this.state.username)){
                    if(messageMap[msgObj.fromUser]){
                        messageMap[msgObj.fromUser].push(msgObj);
                    }
                    else messageMap[msgObj.fromUser]=[msgObj];
                }
                    
                    
            
        }
        this.setState({
            isLoading:false,
            messageMap:messageMap
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
        console.log("going to chat with"+username)
       this.setState({
           showChatView:true,
           openConvoWith:username
       })
    }
    OnPostDMButtonClicked(messageText){
        console.log("the message text is: "+messageText)
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