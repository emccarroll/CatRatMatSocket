import React, { Component } from 'react';

export default class CreateLogin extends Component {

    constructor(props) {
        super(props);

        // this.onChangeTodoDescription = this.onChangeTodoDescription.bind(this);
        // this.onChangeTodoResponsible = this.onChangeTodoResponsible.bind(this);
        // this.onChangeTodoPriority = this.onChangeTodoPriority.bind(this);
        // this.onSubmit = this.onSubmit.bind(this);

        // this.state = {
        //     todo_description: '',
        //     todo_responsible: '',
        //     todo_priority: '',
        //     todo_completed: false
        // }
    }


    // onSubmit(e) {
    //     e.preventDefault();

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
    // }

    render() {
        return (
            <div style={{ marginTop: 10 }}>
                <h3>LOGIN FOOL</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="username"
                            className="form-control"


                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input
                            type="password"
                            className="form-control"


                        />
                    </div>
                    <div className="form-group Container">
                        <div className="row">
                            <button className="col-4 btn btn-primary" type="button">
                                Forgot Password?
                            </button>
                            <div className="col"></div>
                            
                        
                            <button className="col-4 btn btn-primary" type="button">
                                Login
                            </button>
                        </div>
                        <br></br>
                        <div className="row">
                            <div className="col"></div>
                            <button className="col-5 btn btn-primary" type="button">
                                Create Account
                            </button>
                            <div className="col"></div>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}