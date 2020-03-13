import React, { Component } from 'react';
import PostView from "./postView.component";

export default class HomePage extends Component {




    render() {
        const elems=["Cat1","Cat2","Cat3","Cat4"];
        const items=[];
        for(const [index,value] of elems.entries()){
            items.push(<PostView/>);
        }
        return (
            <div className="Container">
              <div className="row">
                <div class="col-3">
                
                </div>
                <div className="col-6">
                
                <div className="Container">

                    <div className="row">
                        <div className="col-12">
                        <ul class="nav nav-pills nav-fill">
                        <li class="nav-item nav-link active">
                            All Content
                        </li>
                        <li class="nav-item nav-link">
                            Following Feed
                        </li>
                        
                        </ul>
                        </div>
                    
                    </div>
                    <div className="row">
                        <div className="col-12">
                        {items}
                        </div>
                    
                    
                    </div>



                </div>
                
                
                



                </div>
                <div className="col-3">
                
                </div>
            </div>
            </div>
        )
    }
}