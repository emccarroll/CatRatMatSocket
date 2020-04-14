import React, { Component } from 'react';
import axios from 'axios';

export default class CreatePost extends Component {

    constructor(props) {
        super(props);

        this.onChangePostDescription = this.onChangePostDescription.bind(this);
        this.onChangePostFile = this.onChangePostFile.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            image_obj: null,
            image_name:'Select image',
            image_description: ''
        }
    }

    onChangePostDescription(e) {
        this.setState({
            image_description: e.target.value
        });
    }

    onChangePostFile = e => {
        var obj = e.target.files[0]
        var filename = obj['name'];
        console.log(obj);
        this.setState({
            image_obj: obj,
            image_name: filename
        });
    }



    onSubmit(e) {
        e.preventDefault();
        
        console.log(`Form submitted:`);
        //console.log(`Post Description: ${this.state.Post_description}`);
        
        const fd = new FormData();
        fd.append('file', this.state.image_obj);
        fd.append('text', this.state.image_description);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };

        axios.defaults.withCredentials = true;
        axios.post('http://localhost:3000/posts/add',fd, {
            onUploadProgress: progressEvent => {
                console.log('Upload Progress: '+ progressEvent.loaded / progressEvent.total * 100 + '%')
            }
        }, config).then(res=>{
            console.log(res);
            if (res.status == 200){
                console.log("Upload complete!");
            }
            else{
                console.log("Upload failed")
            }
        });

        this.setState({
            image_description: '',
            image_obj: null,
            image_name: 'Choose image'
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
                        <label class="custom-file-label" for="customFile">{this.state.image_name}</label>
                        </div>

                    <div className="form-group" style={{marginTop: 10}}>
                        <input type="submit" value="Create Post" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}