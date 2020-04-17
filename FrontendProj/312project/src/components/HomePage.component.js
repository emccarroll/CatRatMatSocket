import React, { Component } from 'react';
import PostView from "./postView.component";
import "./homePage.css";
import {Redirect} from 'react-router-dom';

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {isAllContent: false,
            GoToCommentPage:false,
            SelectedPost:"",
            posts: []
        
        
        };
    
        // This binding is necessary to make `this` work in the callback
        this.FeedSwitch = this.FeedSwitch.bind(this);
        this.OnGoToCommentsButtonClicked=this.OnGoToCommentsButtonClicked.bind(this);
      }
      componentDidMount() {

        this.getPosts();
      }

      getPosts(){
        
        fetch(
            "http://localhost:3000/posts",
            {
              method: "get"
              
            }
          )
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
                this.setState(state => ({
                    posts: result
                  }));
                
              
            })
            .catch((error) => {alert("Error getting Posts", error); alert(error)});

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
       // const items=[];
        //for(const [index,value] of elems.entries()){
        //    items.push(<PostView OnGoToCommentsButtonClicked={this.OnGoToCommentsButtonClicked}/>);
        //}
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
                        {this.state.posts.map(item => (
                                     <PostView key={item} postId={item._id} postData={item} OnGoToCommentsButtonClicked={this.OnGoToCommentsButtonClicked}/>
                                    ))}
                        
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