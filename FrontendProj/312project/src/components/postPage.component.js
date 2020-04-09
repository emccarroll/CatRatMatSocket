import React, { Component } from 'react';
import "./postView.css"
import "./postPage.css"
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faHeart,faComment} from '@fortawesome/fontawesome-free-regular'
import { faHeart as faHeartSolid, faComment as faCommentSolid } from '@fortawesome/free-solid-svg-icons'
import {Redirect, useParams} from 'react-router-dom';


import { s } from '@fortawesome/free-solid-svg-icons'

export default class PostView extends Component {

    constructor(props) {
        super(props);
        
        this.state = {isLiked: false, isCommented: false,
        
            postData: "",
                comments: [],
                goBackToHomePage:false
                
        };
    
        // This binding is necessary to make `this` work in the callback
        this.handleLike = this.handleLike.bind(this);
        this.handleComment = this.handleComment.bind(this);
        this.OnPostCommentButtonClicked = this.OnPostCommentButtonClicked.bind(this);
      }

      componentDidMount() {
        const { postId } = this.props.match.params
        this.setState(state => ({
            thepostId: postId
          }));
        this.getPost();
      }

    handleLike(){
        this.setState(state => ({
            isLiked: !state.isLiked
          }));
    }

getPost(){
    const { postId } = this.props.match.params
    fetch(
        "http://localhost:3000/posts/"+postId,
        {
          method: "get"
          
        }
      )
        .then((res) => res.json())
        .then((result) => {
            console.log(result);
            this.setState(state => ({
                postData: result,
                comments: result.comments
              }));
            
          
        })
        .catch((error) => {alert("Error getting PostData", error); alert(error)});




}
handleComment(){
    this.setState(state => ({
       goBackToHomePage:true
      }));
    }

    OnPostCommentButtonClicked(){
        const { postId } = this.props.match.params
        fetch(
            "http://localhost:3000/posts/comment/"+postId,
            {
                //credentials: 'include',
               // mode: "same-origin",
              method: "post",
              headers: {
                'Content-Type': 'application/json'},
                
              body: JSON.stringify({
                
                "text":"this.state."
              }),
            }
          )
            .then((res) => res.text())
            .then((result) => {
                console.log(result);
                this.setState(state => ({
                    isCommented: !state.isCommented
                  }));
                
              
            })
            .catch((error) => {alert("Error getting ProfileData", error); alert(error)});
        }


        
    


    render() {
        if(this.state.goBackToHomePage===true){
            return(
                <Redirect push
                    to={"/"}
                    />
                )
        }
        return (
            <div className="container postContainer">
                <div className="row">
                <div  className="col-8">
                <div className="container">
                <div className="row">
                
                    <div className="col-2">
                        <img src="data:image/png;base64,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" style={{width: '60px'}}></img>

                    </div>
                    <div className="col-10">
                        MyUsername
                    </div>
                    </div>
                <div className="row justify-content-center">
                
                <img className="images" src="https://homemadehooplah.com/wp-content/uploads/2019/01/buffalo-chicken-wings-1.jpg" />

                </div>
                <div className="row">
                    <hr size="2px"></hr>
                </div>
                <div className="row bottomHalf">
                    <div className="col-1">
                    <FontAwesomeIcon className="like" icon={this.state.isLiked? faHeartSolid : faHeart} size="2x"  onClick={(e)=> this.handleLike(e)}/>
                    </div>
                    <div className="col-1">
                    <FontAwesomeIcon className="like" icon={this.state.isCommented? faCommentSolid : faComment} size="2x" onClick={(e)=> this.handleComment(e)}/>
                    </div>
                </div>
                <div className="row">
                <div className="col">
                    8 Likes
                    </div>
                </div>
                <div className="row">
                <div className="col">
                    NissanUSA This is a comment
                    </div>
                </div>
                </div>
                </div>
                <div  className="col-4">
                <div className="container fill  CommentSection border">
                    <div className="row TopCommentSection border-bottom" >
                            <div className="col d-flex justify-content-center align-items-center">
                            
                            <h2>Comment Section</h2>

                            </div>
                    </div>
                    <div className="row CommentFeed overflow-auto">
                        <div className="col noPad ">
                            
                            <ul className="list-group list-group-flush">
                                    {this.state.comments.map(item => (
                                     <li className="list-group-item" key={item}>{item.user}: {item.text}</li>
                                    ))}
                                
                               
                            </ul>




                        </div>
                    </div>
                    <div className="row BottomCommentSection border-top" >
                        <div className="col d-flex justify-content-center align-items-center">
                            
                            {/*<div className="d-flex justify-content-center align-items-center align-self-center">*/}
                                <div className="input-group mb-3 noPad noMar">
                                    <input type="text" class="form-control" aria-label="Text input with segmented dropdown button for commenting" placeholder="Comment Here"  aria-describedby="button-addon2"/>
                                    
                                    <div className="input-group-append">
                                        <button className="btn btn-outline-primary" type="button" id="button-addon2" onClick={(e) => this.OnPostCommentButtonClicked(e)}>Post</button>
                                    </div>
                                </div>
                                {/* </div>*/}

                            </div>
                        
                    </div>
                </div>
                </div>
                </div>
            </div>
        )
    }
}