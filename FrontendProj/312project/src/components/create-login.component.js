import React, { Component } from 'react';
import "./loginPage.css"
import { Link } from 'react-router-dom';
import {Redirect, useParams} from 'react-router-dom';

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
            "http://localhost:3000/users/login",
            {
              method: "post",
              headers: {
                'Content-Type': 'application/json'},
              body:JSON.stringify({
                "username": "jacobTesterman2",
	            "password": "securepassword?"
              }),
                
              
            }
          )
            .then((res) => res.text())
            .then((result) => {
                console.log(result);
                this.setState(state => ({
                    goToHomePage:true
                  }));
                
              
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
                            <button className="col-4 btn btn-primary" type="button">
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