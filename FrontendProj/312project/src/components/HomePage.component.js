import React, { Component } from 'react';
import PostView from "./postView.component";
import "./homePage.css";
import {Redirect} from 'react-router-dom';

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {isAllContent: false,
            GoToCommentPage:false,
            SelectedPost:"24",
        
        
        
        };
    
        // This binding is necessary to make `this` work in the callback
        this.FeedSwitch = this.FeedSwitch.bind(this);
        this.OnGoToCommentsButtonClicked=this.OnGoToCommentsButtonClicked.bind(this);
      }

    FeedSwitch(){
        this.setState(state => ({
            isAllContent: !state.isAllContent
          }));
    }
    OnGoToCommentsButtonClicked(postId){

        this.setState({GoToCommentPage:true,
        SelectedPost: postId});
    }

    render() {

        if(this.state.GoToCommentPage===true){
            return(
                <Redirect push
                    to={"/post/"+this.state.SelectedPost}
                    />
                )
        }

        const elems=["Cat1","Cat2","Cat3","Cat4"];
        const items=[];
        for(const [index,value] of elems.entries()){
            items.push(<PostView OnGoToCommentsButtonClicked={this.OnGoToCommentsButtonClicked}/>);
        }
        return (
            <div className="Container">
              <div className="row">
                <div className="col-3">
                
                </div>
                <div className="col-6">
                
                <div className="Container">

                    <div className="row">
                        <div className="col-12">
                        <ul className="nav nav-pills nav-fill">
                        <li className={this.state.isAllContent ? 'nav-item nav-link active tab' : 'nav-item nav-link tab'} onClick={(e)=> this.FeedSwitch(e)}>
                            All Content
                        </li>
                        <li className={this.state.isAllContent ? 'nav-item nav-link tab' : 'nav-item nav-link active tab'} onClick={(e)=> this.FeedSwitch(e)}>
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