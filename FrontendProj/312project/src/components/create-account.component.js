import React, { Component } from 'react';
import "./loginPage.css"

export default class CreateAccount extends Component {

    constructor(props) {
        super(props);

        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangePasswordVerify = this.onChangePasswordVerify.bind(this);

        this.state = {
            username: "",
            password: "",
            passwordverify: "",
            raw: {},
            status: ""
        }
    }

    onChangeUsername(e) {
        this.state.raw['usersignup'] = e.target.value;
        this.setState({
            username: e.target.value
        });
    }

    onChangePassword(e){
        this.state.raw['passwordsignup'] = e.target.value;
        this.setState({
            password: e.target.value
        });
    }

    onChangePasswordVerify(e){
        this.setState({
            passwordverify: e.target.value
        });
    }


    onSubmit(e) {
        e.preventDefault();

        if(this.state.password.localeCompare(this.state.passwordverify)){
            alert("Passwords do not match");
        }
        else{
            console.log(JSON.stringify(this.state.raw));
            fetch('http://localhost:3000/users/createAccount', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Connection': 'keep-alive'
                },
                body: JSON.stringify(this.state.raw)
            }).then(res=>{
                console.log(res);
                if (res.status == 200){
                    this.setState({
                        status: 'Account ' + this.state.username + '  created successfully!',
                        username: '',
                        password: '',
                        passwordverify: ''
                    })
                }
                else if (res.status == 400){
                    this.setState({
                        status: 'ERROR: Username ' + this.state.username + ' already exists',
                        username: ''
                    })
                }
                else{
                    this.setState({
                        status: 'ERROR: Something went wrong. Please try again.',
                        username: '',
                        password: '',
                        passwordverify: ''
                    })
                }
            });
        } 
    }

    render() {
        return (
            <div style={{ marginTop: 10 }}>
                <h3>Create account:</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="username"
                            className="form-control"
                            onChange={this.onChangeUsername}
                            value = {this.state.username}


                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input
                            type="password"
                            className="form-control"
                            onChange={this.onChangePassword}
                            value = {this.state.password}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Repeat Password: </label>
                        <input
                            type="password"
                            className="form-control"
                            onChange={this.onChangePasswordVerify}
                            value = {this.state.passwordverify}
                            required
                        />
                    </div>
                    <div className="form-group Container">
                        <div className="row">
                            <button className="col-4 btn btn-primary" type="button" onClick={this.onSubmit}>
                                Create
                            </button>
                            <span style={{marginLeft: 10, marginTop: 7}}>{this.state.status}</span>

                        </div>
                        <br></br>

                    </div>

                </form>
            </div>
        )
    }
}