import React, { Component } from 'react';
import PostView from "./postView.component";

export default class HomePage extends Component {
    render() {
        return (
            <div className="Container">
              <div className="row">
                <div class="col-3">
                One of three columns
                </div>
                <div className="col-6">
                
                <PostView/>



                </div>
                <div className="col-3">
                One of three columns
                </div>
            </div>
            </div>
        )
    }
}