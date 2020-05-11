import React, { Component } from "react";
import * as Constants from "../../Constants.js";
import "./dmStyles.css"

export default class ConvoView extends Component {
    constructor(props) {
        super(props);
        this.state={
            DMInputText:""
        }

        this.handleInputChange=this.handleInputChange.bind(this);
        this.OnPostDMButtonClicked=this.OnPostDMButtonClicked.bind(this);
        this.updateReadStatus=this.updateReadStatus.bind(this);
        
    }
    componentDidMount(){
        this.updateReadStatus(this.props.messages);
    }


    updateReadStatus(messages){

        var newM=messages;
        for( var i in newM){
            if(newM[i].readStatus===false && newM[i].toUser===this.props.username){
                newM[i].readStatus=true;

                fetch(
                    Constants.config.url["API_URL"]+"/chat/markRead/"+newM[i]._id,
                    {
                      method: "post",
                      
                      credentials: "include",
                      
                      headers: {
                        'Content-Type': 'application/json'}
                        
                      
                    }
                  )
                    .then((res) => res.json())
                    .then((result) => {
                        console.log(result);
                        if(result.Status==="success"){
                            
                        }
                        
                        
                      
                    })
                    .catch((error) => {alert("Error getting updating read status", error); alert(error)});



            }
        }
        
        this.props.updatedReadStatus();
    }


    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

      OnPostDMButtonClicked(){

        this.props.OnPostDMButtonClicked(this.state.DMInputText);
        this.setState({DMInputText:""});
      }



    render(){
        return(            
                    <div className="d-flex flex-column">    
                    <div className="CommentFeed overflow-auto">
                        
                            
                            <ul className="list-group width100   list-group-flush overflow-auto maxH">
                                {this.props.isLoading ? <div>Loading</div> :
                                    this.props.messages.map(item => (
                                        <li key={item._id} className="list-group-item pointer text-wrap text-break">{item.fromUser}: {item.message}</li>
                                        ))
                                }
                                
                                
                            </ul>




                        
                    </div>
                    <div className="border-top " >
                        <div className="d-flex justify-content-center align-items-center">
                            
                            {/*<div className="d-flex justify-content-center align-items-center align-self-center">*/}
                                <div className="input-group mb-3 noPad noMar">
                                    <input type="text" class="form-control" name="DMInputText" aria-label="Text input with segmented dropdown button for messaging" placeholder="Message"  aria-describedby="button-addon2" value={this.state.DMInputText} onChange={this.handleInputChange}/>
                                    
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-primary" type="button" id="button-addon2" onClick={() => this.props.OnPostDMButtonClicked(this.state.DMInputText)}>Send</button>
                                    </div>
                                </div>
                                {/* </div>*/}

                            </div>
                        
                    </div>   
                    </div>         
        )




    }


}