const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = 3000;
const mongoIP = "mongo";
const mongoPort = 27017;
const postRoutes = express.Router();
const userRoutes = express.Router();

let Post = require('./post.model');
let Account = require('./account.model');
var bcrypt = require('bcrypt');
const saltRounds = 10;

app.use(cors());
app.use(bodyParser.json());
app.use('/posts', postRoutes);
app.use('/users', userRoutes);


mongoose.connect('mongodb://db:27017/catratmat');
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

postRoutes.route('/').get(function (req, res) {
    Post.find(function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.json(posts);
        }
    });
});

postRoutes.route('/:id').get(function (req, res) {
    let id = req.params.id;
    Post.findById(id, function (err, post) {
        res.json(post);
    });
});

postRoutes.route('/add').post(function (req, res) {
    let post = new Post(req.body);
    post.save()
        .then(post => {
            res.status(200).json({ 'post': 'post added successfully' });
        })
        .catch(err => {
            res.status(400).send('adding new post failed');
        });
});

userRoutes.route('/createAccount').post(function (req, res) {
    bcrypt.hash(req.body.passwordsignup, saltRounds, function (err, hash) {

        const username = req.body.usersignup;
        const passwordHash = hash;
        const authSession = "";


        Account.find({ user: username }, function (err, data) {

            if (err) {
                console.log(err);
                return;
            }

            if (data.length == 0) {
                let account = new Account();
                account.user = username;
                account.passwordHash = passwordHash;
                account.authSession = authSession;
                account.save()
                    .then(login => {
                        res.status(200).send('account created!');
                    })
                    .catch(err => {
                        res.status(400).send('account creation failed');
                    });
            }
            else {
                res.status(400).send('account by that name already exists!');
            }
        })
    }
    );
});

userRoutes.route('/login').post(function (req, res) {
    
        Account.find({ user: req.body.username }, function (err, accounts) {
            if (err) {
                console.log(err);
                return;
            }

            if (accounts.length == 0) {
                res.send('login incorrect');
                console.log('no user');
            }else{

                bcrypt.compare(req.body.password, accounts[0].passwordHash, function(err, result) {
                    if (result){
                        res.send('login correct (TODO make this functional)');
                    }else{
                        res.send('login incorrect');
                    }
                });
                
            }

        })
    

});

userRoutes.route('/').get(function (req, res) {
    Account.find(function (err, account) {
        if (err) {
            console.log(err);
        } else {
            res.json(account);
        }
    });
});

postRoutes.route('/comment/:id').post(function (req, res) {
    Post.findById(req.params.id, function (err, post) {
        if (!post)
            res.status(404).send("data is not found");
        else

            post.comments.push(req.body);

        post.save().then(post => {
            res.json('Post updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});

postRoutes.route('/update/:id').post(function (req, res) {
    Post.findById(req.params.id, function (err, post) {

        if (!post)
            res.status(404).send("data is not found");
        else
            //post.user = req.body.user;
            post.votes = req.body.votes;
        post.src = req.body.src;
        post.text = req.body.text;
        post.comments = req.body.comments;

        post.save().then(post => {
            res.json('Post updated!');
        })
            .catch(err => {
                res.status(400).send("Update not possible");
            });
    });
});



app.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});