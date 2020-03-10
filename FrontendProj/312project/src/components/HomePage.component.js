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
                
                
                
                {items}



                </div>
                <div className="col-3">
                
                </div>
            </div>
            </div>
        )
    }
}