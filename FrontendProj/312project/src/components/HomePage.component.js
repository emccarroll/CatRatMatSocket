import React, { Component } from 'react';
import PostView from "./postView.component";
import "./homePage.css";
import {Redirect} from 'react-router-dom';
import * as Constants from "../Constants.js";

export default class HomePage extends Component {

    constructor(props) {
        super(props);
        this.state = {isAllContent: false,
            GoToCommentPage:false,
            SelectedPost:"",
            posts: [],
            prevDataFromParent: null,
            postIds:[]
        
        
        };
    
        // This binding is necessary to make `this` work in the callback
        this.FeedSwitch = this.FeedSwitch.bind(this);
        this.OnGoToCommentsButtonClicked=this.OnGoToCommentsButtonClicked.bind(this);
      }
      componentDidMount() {
        console.log("on the home page")
        
        //this.props.socketHandler("HomePage");
        this.getPosts();
      }

    componentWillUnmount(){
        console.log("leaving the Home page")
            
        }

        static getDerivedStateFromProps(props, state) {
            // Any time the current user changes,
            // Reset any parts of state that are tied to that user.
            // In this simple example, that's just the email.
            const {posts} =state;
            console.log("Yo boii this is it");
            console.log(posts);
            
            if (props.dataFromParent !== state.prevDataFromParent) {
                if(/* state.postIds.includes(props.dataFromParent.id) */ true){
                    if(props.dataFromParent.updateType==="vote"){
                        console.log("Yo we not updating the posts yea");
                        const {posts} =state;
                        console.log(posts);
                        if(posts.length!==0){
                            const i=posts.findIndex((x)=> x._id===props.dataFromParent.id);
                            console.log("the value of i is: "+i);
                            const postToUpdate= posts[i];
    
                            postToUpdate.votes=props.dataFromParent.vote;
                            postToUpdate.voters=props.dataFromParent.voters;
                            posts[i]=postToUpdate;
    
                            
    
                            /* const {comments} = state;
                            comments.push(props.dataFromParent.vote);
                            console.log("weupdating state"); */
                            //state.comments.push(props.dataFromParent.comment);
                            return {
                                prevDataFromParent: props.dataFromParent,
                                posts:posts
                              };
                        }
                        else{
                           return{};
                        }
                        
                    }
                    else if(props.dataFromParent.updateType==="post"){
                        console.log("Yo we updating the posts yea");
                        const {posts} =state;
                        
                        posts.push(props.dataFromParent.post);
                        

                        

                        

                        /* const {comments} = state;
                        comments.push(props.dataFromParent.vote);
                        console.log("weupdating state"); */
                        //state.comments.push(props.dataFromParent.comment);
                        return {
                            prevDataFromParent: props.dataFromParent,
                            posts:posts
                          };
                    }
                }
             
            }
            return null;
          }





      getPosts(){
        
        fetch(
            Constants.config.url["API_URL"]+"/posts",
            {
              method: "get"
              
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
                                     <PostView key={item._id} postId={item._id} postData={item} OnGoToCommentsButtonClicked={this.OnGoToCommentsButtonClicked}/>
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