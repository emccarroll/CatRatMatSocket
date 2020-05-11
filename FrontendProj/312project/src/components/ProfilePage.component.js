import React, { Component } from 'react';

import PostView from "./postView.component";
import {Redirect, Link} from 'react-router-dom';
import * as Constants from "../Constants.js";

export default class ProfilePage extends Component {

    constructor(props) {
        super(props);
        this.state = {isFollowing: false,
            posts: [],
            userNotFound:false,
            loading:true
            };
    
        // This binding is necessary to make `this` work in the callback
        this.handleFollow = this.handleFollow.bind(this);
        this.OnGoToCommentsButtonClicked=this.OnGoToCommentsButtonClicked.bind(this);
      }

    handleFollow(){
          //localhost:3000/users/toggleFollow/jacobTesterman2
          fetch(
            Constants.config.url["API_URL"]+"/users/toggleFollow/"+this.state.profileUsername,
              {
                credentials: 'include',
                method: "post"
              }
            ).then((res) => res.json())
            .then((result) => { 
              if (result.status == "success"){
                console.log("toggled successfully");
                this.setState(state => ({
                  isFollowing: !this.state.isFollowing,
                }));
              }
              else{
                console.log(result);
                console.log("toggle unsuccessful");
              }
            }
          ).catch((error) => {alert("Error. Maybe try logging in?", error)});
  
    }

    OnGoToCommentsButtonClicked(postId){

        this.setState({GoToCommentPage:true,
        SelectedPost: postId});
    }


    componentDidMount() {
        console.log("on the profile page")
        //dthis.props.socketHandler("ProfilePage");
        const { profileUsername } = this.props.match.params
        let setIsFollowing = this.setIsFollowing(profileUsername);
        this.setState(state => ({
            profileUsername: profileUsername,
          }));
        this.getPosts(profileUsername);
      }

    setIsFollowing(profileUsername) {
            fetch(
            Constants.config.url["API_URL"]+"/users/amIFollowing/"+profileUsername,
              {
                credentials: 'include',
                method: "get"
              }
            ).then((res)=>{ return res.json() }).then((text)=>{
              this.setState(state => ({
                isFollowing: text.following,
              }));
          }).catch((error) => {alert("ERROR");this.state.isFollowing = false});
    }

    componentWillUnmount(){
        console.log("leaving the profile page")
            
        }



    getPosts(profileUsername){
      
      fetch(
        Constants.config.url["API_URL"]+"/posts/user/"+profileUsername,
          {
            method: "get"
            
          }
        )
          .then((res) => res.json())
          .then((result) => {
            if(result.status==="Success"){
              console.log(result);
              this.setState(state => ({
                  loading:false,
                  userNotFound:false,
                  posts: result.posts
                }));

                var arr =result.posts;
                var x= JSON.stringify(arr);
                this.props.socketHandler(x);
              
            }
            else{
              this.setState(state =>({
                loading:false,
                userNotFound:true,
              }))
            }
              
            
          })
          .catch((error) => {alert("Error getting Posts", error); alert(error)});

    }






    render() {
       // const elems=["Cat1","Cat2","Cat3","Cat4"];
       // const items=[];
       // for(const [index,value] of elems.entries()){
       //     items.push(<PostView/>);
        //}
        const { profileUsername } = this.props.match.params

        if(this.state.userNotFound){
          return(
            <div className="Container">User Not Found</div>
          )
        }
        if(this.state.GoToCommentPage===true){
          return(
              <Redirect push
                  to={"/post/"+this.state.SelectedPost}
                  />
              )
      }
        return (
            <div className="Container">
              
                
              
                <div className="Container">
                    <div className="row">
                        <div class="col-1">
                                <img src="data:image/png;base64,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" style={{width: '60px'}}></img>

                            </div>
                        <div className="col-1">{this.state.loading ? "loading..." : profileUsername }</div>

                        <div className="col-1">
                            <button type="button" className="btn btn-primary" onClick={(e)=> this.handleFollow(e)}>{this.state.isFollowing ? 'Following' : 'Follow'}</button>
                        </div>
                    </div>


                </div>

                <div className="Container">
                  <div className="row">
                    <div className="col-3">
                    
                    </div>
                    <div className="col-6">
                    
                                    {this.state.loading ? "Loading": 
                                    
                                      this.state.posts.length===0 ? "This user doesnt have any posts" :
                                      this.state.posts.map(item => (
                                        <PostView key={item._id} postId={item._id} postData={item} OnGoToCommentsButtonClicked={this.OnGoToCommentsButtonClicked} onProfilePage={true}/>
                                        ))
                                    
                                    
                                    
                                    
                                    
                                    }
                    
                                    



                    </div>
                    <div className="col-3">
                    
                    </div>
                </div>
                
                </div>


                   
            </div>
            
        )
    }
}