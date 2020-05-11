import React, { Component } from "react";
import * as Constants from "../../Constants.js";
import "./dmStyles.css"

export default class ComposeNew extends Component {
    constructor(props) {
        super(props);
        this.state={
            DMInputText:"",
            toNewusernameText: "",

        }

        this.handleInputChange=this.handleInputChange.bind(this);
        this.OnPostDMButtonClicked=this.OnPostDMButtonClicked.bind(this);
        
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
        //this.props.clearError();
      }

      OnPostDMButtonClicked(){

        this.props.OnPostDMButtonClicked(this.state.DMInputText);
        this.setState({DMInputText:""});
      }



    render(){
        return(            
                    <div className="d-flex flex-column">    
                        <div>{this.props.ComposeNewError}</div>
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="inputGroup-sizing-sm">To Username</span>
                            </div>
                            <input type="text" name="toNewusernameText"  value={this.state.toNewusernameText}  onChange={this.handleInputChange} className="form-control" aria-label="To Username" aria-describedby="inputGroup-sizing-sm"/>
                        </div>


                    
                        <div className="d-flex justify-content-center align-items-center">
                            
                            {/*<div className="d-flex justify-content-center align-items-center align-self-center">*/}
                                <div className="input-group mb-3 noPad noMar">
                                    <input type="text" class="form-control" name="DMInputText" aria-label="Text input with segmented dropdown button for commenting" placeholder="Message"  aria-describedby="button-addon2" value={this.state.DMInputText} onChange={this.handleInputChange}/>
                                    
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-primary" type="button" id="button-addon2" onClick={() => this.props.OnPostDMToNewUserButtonClicked(this.state.toNewusernameText,this.state.DMInputText)}>Send</button>
                                    </div>
                                </div>
                                {/* </div>*/}

                            </div>
                        
                      
                    </div>         
        )




    }


}