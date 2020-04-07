import React, { Component } from 'react';

export default class CreatePost extends Component {

    constructor(props) {
        super(props);

        this.onChangePostDescription = this.onChangePostDescription.bind(this);
        this.onChangePostFile = this.onChangePostFile.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            Post_description: '',
            Post_file: '',
            Post_completed: false
        }
    }

    onChangePostDescription(e) {
        this.setState({
            Post_description: e.target.value
        });
    }

    onChangePostFile(e) {
        this.setState({
            Post_file: e.target.value
        });
    }


    

    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Form submitted:`);
        console.log(`Post Description: ${this.state.Post_description}`);
        console.log(`Post File: ${this.state.Post_file}`);
        console.log(`Post Priority: ${this.state.Post_priority}`);
        
        this.setState({
            Post_description: '',
            Post_file: '',
            Post_completed: false
        })
    }

    render() {
        return (
            <div style={{marginTop: 10}}>
                <h3>Create Post</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group"> 
                        <label>Description: </label>
                        <input  type="text"
                                className="form-control"
                                value={this.state.Post_description}
                                onChange={this.onChangePostDescription}
                                />
                    </div>
                    <div class="form-group custom-file">
                        <input type="file" class="custom-file-input" id="customFile" value={this.state.Post_file}
                                onChange={this.onChangePostFile}/>
                        <label class="custom-file-label" for="customFile">Choose file</label>
                        </div>

                    <div className="form-group" style={{marginTop: 10}}>
                        <input type="submit" value="Create Post" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}