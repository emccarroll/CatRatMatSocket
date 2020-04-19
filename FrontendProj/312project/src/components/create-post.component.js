import React, { Component } from 'react';

export default class CreatePost extends Component {

    constructor(props) {
        super(props);

        this.onChangePostDescription = this.onChangePostDescription.bind(this);
        this.onChangePostFile = this.onChangePostFile.bind(this);

        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            image_obj: null,
            image_name:'Select image',
            image_description: '',
            upload_progress: ''
        }
    }

    onChangePostDescription(e) {
        this.setState({
            image_description: e.target.value
        });
    }

    onChangePostFile = e => {
        if(e.target.value.length > 0){
            var obj = e.target.files[0];
            var filename = obj['name'];
            console.log(obj);
            this.setState({
                image_obj: obj,
                image_name: filename
            });
        } else {
            console.log("cancel was clicked");
        }
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

        fetch('http://localhost:3000/posts/add', {
            credentials: 'include',
            method: 'POST',
            body: fd
        }).then((res)=>{ return res.text() }).then((text)=>{
            console.log(text);
            if (text.includes("post added")){
                console.log("Upload complete!");
                this.setState({
                    upload_progress: 'Upload Successful'
                });
            }
            else if(text.includes("invalid authentication token")){
                console.log("Upload failed");
                this.setState({
                    upload_progress: 'Upload Failed. Please log in and try again.'
                });
            }
            else{
                console.log("Upload failed");
                this.setState({
                    upload_progress: 'Upload failed. Please try again.'
                });
            }
            this.setState({
                image_description: '',
                image_obj: null,
                image_name: 'Choose image'
            })
        });
        
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
                                value={this.state.image_description}
                                onChange={this.onChangePostDescription}
                                />
                    </div>
                    <div class="form-group custom-file">
                        <input type="file" class="custom-file-input" id="customFile" value={this.state.Post_file}
                                onChange={this.onChangePostFile}/>
                        <label class="custom-file-label" for="customFile">{this.state.image_name}</label>
                        </div>

                    <div className="submit-upload" style={{marginTop: 10}}>
                        <input type="submit" value="Create Post" className="btn btn-primary" />
                        <span style={{marginLeft: 10}}>{this.state.upload_progress}</span>
                    </div>
                </form>
            </div>
        )
    }
}