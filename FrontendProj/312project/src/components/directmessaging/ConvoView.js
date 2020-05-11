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
                        <div className="noPad ">
                            
                            <ul className="list-group width100 overflow-auto">
                                {this.props.isLoading ? <div>Loading</div> :
                                    this.props.messages.map(item => (
                                        <li key={item.message} className="list-group-item pointer text-wrap text-break">{item.message}</li>
                                        ))
                                }
                                
                                
                            </ul>




                        </div>
                    </div>
                    <div className="border-top " >
                        <div className="d-flex justify-content-center align-items-center">
                            
                            {/*<div className="d-flex justify-content-center align-items-center align-self-center">*/}
                                <div className="input-group mb-3 noPad noMar">
                                    <input type="text" class="form-control" name="DMInputText" aria-label="Text input with segmented dropdown button for commenting" placeholder="Comment Here"  aria-describedby="button-addon2" value={this.state.DMInputText} onChange={this.handleInputChange}/>
                                    
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-primary" type="button" id="button-addon2" onClick={() => this.props.OnPostDMButtonClicked()}>Post</button>
                                    </div>
                                </div>
                                {/* </div>*/}

                            </div>
                        
                    </div>   
                    </div>         
        )




    }


}