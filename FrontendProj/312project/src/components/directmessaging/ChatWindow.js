import React, { Component } from "react";
import * as Constants from "../../Constants.js";
import ListOfConversations from "./ListOfConversations"
import ConvoView from "./ConvoView"
import ComposeNew from "./ComposeNew"
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
        this.OnPostDMToNewUserButtonClicked=this.OnPostDMToNewUserButtonClicked.bind(this);
        this.updatedReadStatus=this.updatedReadStatus.bind(this);
        //this.ConvoView=this.ConvoView.bind(this);
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
            console.log(onNewMessage);

            if((onNewMessage.fromUser===this.state.username)&&(onNewMessage.toUser===this.state.username)){
                if(messageMap[onNewMessage.fromUser]){
                    messageMap[onNewMessage.fromUser].obj.push(onNewMessage);
                    if(!onNewMessage.readStatus){
                        messageMap[onNewMessage.fromUser].readStatus=false;
                    }
                }
                else messageMap[onNewMessage.fromUser]={readStatus:onNewMessage.readStatus,obj:[onNewMessage]};
            }
            else if((onNewMessage.fromUser===this.state.username)&&(onNewMessage.toUser!==this.state.username)){
                if(messageMap[onNewMessage.toUser]){
                    messageMap[onNewMessage.toUser].obj.push(onNewMessage);
                    /*if(!onNewMessage.readStatus){
                        messageMap[onNewMessage.toUser].readStatus=false;
                    }*/
                    console.log("yea man its me2")
                }
                else{
                    messageMap[onNewMessage.toUser]={readStatus:true,obj:[onNewMessage]};
                }
                
            }
            else if((onNewMessage.fromUser!==this.state.username)&&(onNewMessage.toUser===this.state.username)){
                if(messageMap[onNewMessage.fromUser]){
                    messageMap[onNewMessage.fromUser].obj.push(onNewMessage);
                    if(!onNewMessage.readStatus){
                        messageMap[onNewMessage.fromUser].readStatus=false;
                    }
                    console.log("yea man its me")
                }
                else messageMap[onNewMessage.fromUser]={readStatus:onNewMessage.readStatus,obj:[onNewMessage]};
            }
            else{
                console.log((onNewMessage.fromUser!==this.state.username))
                console.log((onNewMessage.toUser===this.state.username))
                console.log(nextProps)
                console.log((onNewMessage).toUser);
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
                        messageMap[msgObj.fromUser].obj.push(msgObj);
                        if(!msgObj.readStatus){
                            messageMap[msgObj.fromUser].readStatus=false;
                        }
                    }
                    else messageMap[msgObj.fromUser]={readStatus:msgObj.readStatus,obj:[msgObj]};
                }
                else if((msgObj.fromUser===this.state.username)&&(msgObj.toUser!==this.state.username)){
                    if(messageMap[msgObj.toUser]){
                        messageMap[msgObj.toUser].obj.push(msgObj);
                        /*if(!msgObj.readStatus){
                            messageMap[msgObj.toUser].readStatus=false;
                        }*/
                    }
                    else{
                        messageMap[msgObj.toUser]={readStatus:true,obj:[msgObj]};
                    }
                    
                }
                else if((msgObj.fromUser!==this.state.username)&&(msgObj.toUser===this.state.username)){
                    if(messageMap[msgObj.fromUser]){
                        messageMap[msgObj.fromUser].obj.push(msgObj);
                        if(!msgObj.readStatus){
                            messageMap[msgObj.fromUser].readStatus=false;
                        }
                    }
                    else messageMap[msgObj.fromUser]={readStatus:msgObj.readStatus,obj:[msgObj]};
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
    OnPostDMToNewUserButtonClicked(toUser,messageText){
        console.log("the message text is: "+messageText)
        console.log("sending to "+ toUser);
        fetch(
            Constants.config.url["API_URL"]+"/chat/message",
            {
              method: "post",
              
              credentials: "include",
              
              headers: {
                'Content-Type': 'application/json'},
                
              body: JSON.stringify({
                "username": toUser,
                "message": messageText
              })
            }
          )
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                if(result.Status==="success"){
                    
                }
                else if(result.message==="specified user does not exist"){
                    this.setState({ComposeNewError:"User Does Not Exist"})
                }
                
              
            })
            .catch((error) => {alert("Error getting DMS", error); alert(error)});
    }
    updatedReadStatus(){
        console.log("Updatin The Read status")
        this.getAllMessages();
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
                                    {this.state.showChatView ||this.state.showComposeNew ? <button onClick={()=>{this.setState({showComposeNew:false,showChatView:false,openConvoWith:null})}} type="button" class="btn btn-link">Back</button>
                                       : <div> </div>
                                        }
                                </div>
                                <div className="col-7">
                                <h4>Direct Messaging</h4>
                                </div>
                                <div className="col-3">
                                {this.state.showChatView ? <div> </div>
                                       : <button onClick={()=>{this.setState({showComposeNew:true})}} type="button" class="btn btn-link">New Convo</button>
                                        }
                                </div>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
                <div className="row">
                    <div className="col-12">
                        
                        {this.state.showComposeNew ? <ComposeNew ComposeNewError={this.state.ComposeNewError}  isLoading={this.state.isLoading} OnPostDMToNewUserButtonClicked={this.OnPostDMToNewUserButtonClicked}></ComposeNew> :
                        
                        this.state.showChatView ? <ConvoView isLoading={this.state.isLoading} updatedReadStatus={this.updatedReadStatus} OnPostDMButtonClicked={this.OnPostDMButtonClicked} username={this.state.username} messages={this.state.messageMap[this.state.openConvoWith].obj}></ConvoView> : 
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