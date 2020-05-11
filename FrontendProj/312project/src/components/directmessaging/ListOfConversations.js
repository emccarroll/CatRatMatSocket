import React, { Component } from "react";
import * as Constants from "../../Constants.js";
import "./dmStyles.css"

export default class ListOfConversations extends Component {
    constructor(props) {
        super(props);

    }





    render(){
        return(            
                        <ul className="list-group width100 overflow-auto">
                            {this.props.isLoading ? <div>Loading</div> :
                                Object.keys(this.props.conversations).map(item => (
                                    <li key={item} onClick={()=>this.props.goToChatView(item)} className="list-group-item pointer text-wrap text-break">{item}</li>
                                    ))
                            }
                            
                            
                        </ul>            
        )




    }




}