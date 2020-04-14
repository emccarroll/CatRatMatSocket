const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const multer  = require('multer');
const path = require('path');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

var upload = multer({ 
    //dest: 'images/'
    storage: storage
 });

let Post = require('./post.model');
let Account = require('./account.model');

const PORT = 3000;
const mongoIP = "mongo";
const mongoPort = 27017;
const postRoutes = express.Router();
const userRoutes = express.Router();
const dataRoutes = express.Router();

const corsOptions = {
    origin: 'http://localhost:8000',
    methods: "GET,HEAD,POST,PATCH,DELETE,OPTIONS",
    credentials: true,
    allowedHeaders: "Content-Type, Authorization, X-Requested-With"
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser('434secretfortestingpurposes12'));
app.use('/posts', cors(corsOptions),upload.single('file'), postRoutes);
app.use('/users', cors(corsOptions), userRoutes);
app.use('/images', cors(corsOptions), dataRoutes);

const saltRounds = 10;




mongoose.connect('mongodb://db:27017/catratmat', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

app.use('/images',express.static('images'))

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

postRoutes.route('/user/:user').get(function (req, res) {

    let username = req.params.user;
    Post.find({user: username}, function (err, posts) {
        res.json(posts);
    });
});

postRoutes.route('/add').post(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        console.log(req.cookies['authToken']);
        console.log(data);
        if (data.length == 0) {
            console.log('test2');
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    var post = new Post();
                    const file = req.file
                    if (file) {
                        post.src = req.file.path;
                    }

                    

                    post.text = req.body.text;
                    post.user = account.user;
                    post.votes = 0;
                    post.voters = {};
                    post.save();
                    res.send('post added!');
                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
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
    });
});

userRoutes.route('/login').post(function (req, res) {

    Account.find({ user: req.body.username }, function (err, accounts) {
        if (err) {
            console.log(err);
            return;
        }

        if (accounts.length == 0) {
            res.send('could not find user:' + req.body.username);
            console.log('could not find user:' + req.body.username);
        } else {

            bcrypt.compare(req.body.password, accounts[0].passwordHash, function (err, result) {
                if (result) {
                    require('crypto').randomBytes(48, function (err, buffer) {
                        var token = buffer.toString('base64');
                        bcrypt.hash(token, saltRounds, function (err, hash) {
                            accounts[0].authSession = hash;
                            accounts[0].save();
                        });
                        res.cookie('authToken', token, { maxAge: 30 * 60000, httpOnly: true });
                        res.cookie('username', accounts[0].user, { maxAge: 30 * 60000, httpOnly: true });
                        res.send('login correct');
                    });

                } else {
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
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    Post.findById(req.params.id, function (err, post) {
                        if (!post)
                            res.status(404).send("data is not found");
                        else if (err) {
                            res.status(404).send("data is not found!");
                            console.log(err);
                        }
                        else {

                            post.comments.push({ user: account.user, text: req.body.text });

                            post.save().then(post => {
                                res.json(post.comments.pop);
                            })
                                .catch(err => {
                                    res.status(400).send("Update not possible");
                                });
                        }
                    });
                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
    });

});

postRoutes.route('/upvote/:id').post(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    Post.findById(req.params.id, function (err, post) {
                        if (!post)
                            res.status(404).send("post is not found");
                        else if (err) {
                            res.status(404).send("post is not found!");
                            console.log(err);
                        }
                        else {
                            //Post found and user verified
                            var voters = post.voters;
                            var voter = voters.get(account.user);
                            
                            console.log(voter);

                            if (voter=='upvote') {
                                post.votes -= 1;
                                post.voters.set(account.user,'neutral');
                                res.status(200).send("unupvote!");
                            } else {
                                post.votes += 1;
                                post.voters.set(account.user, 'upvote');
                                post.save();
                                res.status(200).send("upvote successful");

                            }
                        }
                    });
                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
    });

});

postRoutes.route('/downvote/:id').post(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    Post.findById(req.params.id, function (err, post) {
                        if (!post)
                            res.status(404).send("post is not found");
                        else if (err) {
                            res.status(404).send("post is not found!");
                            console.log(err);
                        }
                        else {
                            //Post found and user verified
                            var voters = post.voters;
                            var voter = voters.get(account.user);
                            
                            console.log(voter);

                            if (voter=='downvote') {
                                post.votes += 1;
                                post.voters.set(account.user,'neutral');
                                res.status(200).send("undownvote!");
                            } else {
                                post.votes -= 1;
                                post.voters.set(account.user, 'downvote');
                                post.save();
                                res.status(200).send("downvote successful");

                            }
                        }
                    });
                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
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