import React, { Component } from 'react';
import "./loginPage.css"
import { Link } from 'react-router-dom';
import {Redirect, useParams} from 'react-router-dom';
import * as Constants from "../Constants.js";

export default class CreateLogin extends Component {

    constructor(props) {
        super(props);

        // this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
        // this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
        // this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
        // this.onSubmit = this.onSubmit.bind(this);
            this.onSubmit = this.onSubmit.bind(this);
            this.handleInputChange = this.handleInputChange.bind(this);
         this.state = {
             username: '',
             password: '',
             goToHomePage: false
         }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
    
        this.setState({
          [name]: value
        });
      }

     onSubmit(e) {
         e.preventDefault();
        console.log("chicken");

        fetch(
            Constants.config.url["API_URL"]+"/users/login",
            {
              credentials: 'include',
                
              method: "POST",
              headers: {
                'Content-Type': 'application/json'},
              body:JSON.stringify({
                "username": this.state.username,//"jacobTesterman2",
	            "password": this.state.password//"securepassword?"
              }),
                
              
            }
          )
            .then((res) => res.text())
            .then((result) => {
                if(result==="login correct"){
                    sessionStorage.setItem("username",this.state.username);
                    this.props.SuccesfullLoginCallback(this.state.username);
                    this.setState(state => ({
                        goToHomePage:true
                      }));
                }
                console.log(result);
                
                
              
            })
            .catch((error) => {alert("Error Logging In", error); alert(error)});






    //     console.log(`Form submitted:`);
    //     console.log(`Todo Description: ${this.state.todo_description}`);
    //     console.log(`Todo Responsible: ${this.state.todo_responsible}`);
    //     console.log(`Todo Priority: ${this.state.todo_priority}`);

    //     this.setState({
    //         todo_description: '',
    //         todo_responsible: '',
    //         todo_priority: '',
    //         todo_completed: false
    //     })
    }

    awwwwwLookAtMeIForgotMyPasswordBooHoo(){
        alert("Well that sucks");
        alert("Maybe lay off those quarantine beers you fool");
        alert("Unfortunately we have not, and likely will not, ever implement this functionality. Tough luck.");
        alert("But here's something to lift your spirits...");
        alert('According to all known laws of aviation, there is no way that a bee should be able to fly. Its wings are too small to get its fat little body off the ground. The bee, of course, flies anyway. Because bees don’t care what humans think is impossible.” SEQ. 75 - “INTRO TO BARRY” INT. BENSON HOUSE - DAY ANGLE ON: Sneakers on the ground. Camera PANS UP to reveal BARRY BENSON’S BEDROOM ANGLE ON: Barry’s hand flipping through different sweaters in his closet. BARRY Yellow black, yellow black, yellow black, yellow black, yellow black, yellow black...oohh, black and yellow... ANGLE ON: Barry wearing the sweater he picked, looking in the mirror. BARRY (CONT’D) Yeah, let’s shake it up a little. He picks the black and yellow one. He then goes to the sink, takes the top off a CONTAINER OF HONEY, and puts some honey into his hair. He squirts some in his mouth and gargles. Then he takes the lid off the bottle, and rolls some on like deodorant. CUT TO: INT. BENSON HOUSE KITCHEN - CONTINUOUS Barry’s mother, JANET BENSON, yells up at Barry. JANET BENSON Barry, breakfast is ready! CUT TO: "Bee Movie" - JS REVISIONS 8/13/07 1. INT. BARRY’S ROOM - CONTINUOUS BARRY Coming! SFX: Phone RINGING. Barry’s antennae vibrate as they RING like a phone. Barry’s hands are wet. He looks around for a towel. BARRY (CONT’D) Hang on a second! He wipes his hands on his sweater, and pulls his antennae down to his ear and mouth. BARRY (CONTD) Hello? His best friend, ADAM FLAYMAN, is on the other end. ADAM Barry? BARRY Adam? ADAM Can you believe this is happening? BARRY Can’t believe it. I’ll pick you up. Barry sticks his stinger in a sharpener. SFX: BUZZING AS HIS STINGER IS SHARPENED. He tests the sharpness with his finger. SFX: Bing. BARRY (CONT’D) Looking sharp. ANGLE ON: Barry hovering down the hall, sliding down the staircase bannister. Barry...');
    }

    render() {
        if(this.state.goToHomePage===true){
            return(
                <Redirect push
                    to={"/"}
                    />
                )
        }
        return (
            <div style={{ marginTop: 10 }}>
                <h3>Login:</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input name="username" type="username"
                            className="form-control"
                            value={this.state.username}
                            onChange={this.handleInputChange}

                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input name="password"
                            type="password"
                            className="form-control"
                            value={this.state.password}
                            onChange={this.handleInputChange}

                        />
                    </div>
                    <div className="form-group Container">
                        <div className="row">
                            <button className="col-4 btn btn-primary" type="button" onClick={this.awwwwwLookAtMeIForgotMyPasswordBooHoo}>
                                Forgot Password?
                            </button>
                            <div className="col"></div>


                            <button className="col-4 btn btn-primary" type="submit">
                                Login
                            </button>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col"></div>
                            <Link className="col-5 btn btn-primary" to="/createAccount">
                                Create Account
                            </Link>
                            <div className="col"></div>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}