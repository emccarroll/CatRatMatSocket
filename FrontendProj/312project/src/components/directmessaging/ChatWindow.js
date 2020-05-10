import React, { Component } from "react";
import * as Constants from "../../Constants.js";
import "./dmStyles.css"

export default class ChatWindow extends Component {
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
                var arr =Array.from(result, x=>x._id);
                this.setState(state => ({
                    posts: result,
                    postIds:arr
                  }));
                  this.props.socketHandler("homepage");
                  /* console.log("the array is");
                  console.log(arr);
                var x= JSON.stringify(arr); */
                  
              
            })
            .catch((error) => {alert("Error getting Posts", error); alert(error)});
    }


    render(){
        


        return(
            <div className="ChatWindow Container-fluid justify-content-center">
                <div className="row">
                    <div className="col-12">
                        <div className="btn-group width100" role="group" aria-label="Basic example">
                            <button type="button" className="btn btn-outline">Chat List</button>
                            <button type="button" className="btn btn-outline">Chat</button>

                        </div>
                    </div>
                    
                </div>
                <div className="row">
                    <div className="col-12">
                        <ul className="list-group width100">
                            <li className="list-group-item">Cras justo odio</li>
                            <li className="list-group-item">Dapibus ac facilisis in</li>
                            <li className="list-group-item">Morbi leo risus</li>
                            <li className="list-group-item">Porta ac consectetur ac</li>
                            <li className="list-group-item">Vestibulum at eros</li>
                            <li className="list-group-item">Vestibulum at eros</li>
                            <li className="list-group-item">Vestibulum at eros</li>
                            <li className="list-group-item">Vestibulum at eros</li>
                        </ul>
                    </div>
                    
                </div>
                
                
            </div>
            
        )




    }


}