const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'build')));



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
let SocketMap = require('./socketMap.model');

const PORT = 3000;
const mongoIP = "mongo";
const mongoPort = 27017;
const postRoutes = express.Router();
const userRoutes = express.Router();
const dataRoutes = express.Router();
const chatRoutes = express.Router();

const dm = io.of('/chat').on('connection', (socket) => {
    socket.on('authenticate', (msg) => {
        console.log(msg.username);
        Account.find({ user: msg.username }, function (err, data) {
            if (data.length == 0) {
                socket.emit('authenticate', 'account doesn\'t exist!');
            } else {
                var account = data[0];
                console.log(account.user);
                console.log(msg.authToken + " " + account.authSession);
                bcrypt.compare(msg.authToken.trim(), account.authSession, function (err, result) {

                    if (result) {
                        SocketMap.find({ user: msg.username }, function (err, data) {
                            if (data.length == 0) {
                                var sM = new SocketMap();
                                sM.user = account.user;
                                sM.socketID = socket.id;
                                sM.save();
                            } else {
                                data[0].socketID = socket.id;
                                data[0].save();
                            }

                        });
                        socket.emit('authenticate', 'login successful! ');

                    } else {
                        console.log(result);
                        socket.emit('authenticate', 'invalid authentication token');
                    }
                });
            }
        });
    });

});

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('listenTo', (msg) => {
        var postArr = JSON.parse(msg);

        //Verify these are legitimate post IDs


        var promise = new Promise(function (resolve, reject) {
            console.log()
            for (const postID of postArr) {
                var loops = 0;
                Post.findById(postID, function (err, post) {
                    if (!post) {
                        console.log('incorrect!');
                        socket.emit({ status: 'error: postID not found' });
                        reject();
                    }
                    else if (err) {
                        socket.emit({ status: 'error: postID not found' });
                        console.log(err);
                        reject();
                    }
                    loops += 1;
                    if (loops == postArr.length) {
                        resolve();
                    }

                });

            }



        });




        promise.
            then(function () {
                socket.leave('homepage');
                for (const postID of postArr) {
                    console.log('joined ' + postID);
                    socket.join(postID);
                }
            }).
            catch(function () {
                console.log('They used the wrong post IDS THOSE FOOLS HAHAHAHAHAHAHAHA');
            });
    });


    socket.on('follow', (msg) => {
        var postArr = JSON.parse(msg);


        //Verify these are legitimate users


        var promise = new Promise(function (resolve, reject) {

            for (const userID of postArr) {
                var loops = 0;
                Account.find({ user: userID }, function (err, post) {
                    console.log(post);
                    if (post.length == 0) {
                        console.log('incorrect!');
                        socket.emit({ status: 'error: username not found' });
                        reject();
                    }
                    else if (err) {
                        socket.emit({ status: 'error: username not found' });
                        console.log(err);
                        reject();
                    }
                    loops += 1;
                    if (loops == postArr.length) {
                        resolve();
                    }

                });

            }



        });




        promise.
            then(function () {
                for (const userID of postArr) {
                    console.log('joined ' + userID);
                    socket.join(userID);
                }
            }).
            catch(function () {
                console.log('They used the wrong post IDS THOSE FOOLS HAHAHAHAHAHAHAHA');
            });
    });


    socket.on('homepage', () => {
        socket.join('homepage');
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

});



app.use(cors());
app.use(bodyParser.json());
app.use(cookieParser('434secretfortestingpurposes12'));
app.use('/posts', upload.single('file'), postRoutes);
app.use('/users', userRoutes);
app.use('/images',  dataRoutes);
app.use('/chat',  chatRoutes);

const saltRounds = 10;


app.post('/image', function (req, res) {
    console.log('receving data');
    res.send('hello world')
})

mongoose.connect('mongodb://db:27017/catratmat', { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;

connection.once('open', function () {
    console.log("MongoDB database connection established successfully");
    bcrypt.hash("securepassword?", saltRounds, function (err, hash) {

        const username = 'jacobTesterman2';
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
                        console.log('account created!');
                    })
                    .catch(err => {
                        console.log('account creation failed');
                    });
            }
            else {
                console.log('account by that name already exists!');
            }
        })
    });
})

app.use('/images', express.static('images'))


app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

postRoutes.route('/').get(function (req, res) {
    Post.find(function (err, posts) {
        if (err) {
            console.log(err);
        } else {
            res.json(posts);
        }
    });
});

chatRoutes.route('/message').post(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, sendingUser) {
        if (sendingUser.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = sendingUser[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    Account.find({ user: req.body.username }, function (err, receivingUser) {

                        if (receivingUser.length == 0) {
                            res.send({ status: 'error', message: 'specified user does not exist' });
                        } else {
                            var specificedUser = receivingUser[0];
                            specificedUser.messages.push({ fromUser: req.cookies['username'], toUser: req.body.username, message: req.body.message, readStatus: false });
                            specificedUser.save();
                            if (req.cookies['username'] != req.body.username) {
                                var userWhoSent = sendingUser[0];
                                userWhoSent.messages.push({ fromUser: req.cookies['username'], toUser: req.body.username, message: req.body.message, readStatus: true });
                                userWhoSent.save();
                            }
                            var lastMessage = specificedUser.messages[specificedUser.messages.length - 1];
                            //TODO: Handle Websocket stuff here
                            SocketMap.find({ user: req.body.username }, function (err, socketUser) {
                                if (socketUser.length == 0) {
                                    console.log('specified user is not logged in?');
                                } else {
                                    var socketID = socketUser[0].socketID;
                                    console.log(socketID);
                                    io.of('/chat').to(socketID).emit('chatUpdate', lastMessage);
                                }
                            });

                            //

                            res.send({ Status: 'success' });
                            console.log(specificedUser.messages);
                        }
                    });

                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
    });

});

chatRoutes.route('/markRead/:id').post(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    var messages = data[0].messages;
                    for (var i = 0; i < messages.length; i++) {
                        if (messages[i]._id == req.params.id) {
                            messages[i].readStatus = true;
                            data[0].messages = messages;
                            data[0].save();
                            res.send({ Status: 'success' });
                            return;
                        }
                    }
                    res.send({ Status: 'error' });

                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
    });

});

userRoutes.route('/toggleFollow/:user').post(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    var account = data[0];
                    if (!account.following) {
                        account.following = {};
                        account.save();
                    }

                    var isFollowing = account.following.get(req.params.user);
                    if (req.cookies['username'] == req.params.user) {
                        if (isFollowing != false) {
                            account.following.set(req.params.user, false);
                            account.save();
                        }
                        res.send({ status: "error", message: "you cannot follow yourself" });
                    }
                    else {
                        if (isFollowing != true) {
                            account.following.set(req.params.user, true);
                            account.save();
                            res.send({ status: "success", message: "followed" });
                            
                        } else {
                            account.following.set(req.params.user, false);
                            account.save();
                            res.send({ status: "success", message: "unfollowed" });
                            
                        }
                    }
                    


                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
    });

});

userRoutes.route('/amIFollowing/:user').get(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    var account = data[0];
                    if (!account.following) {
                        account.following = {};
                        account.save();
                    }

                    var isFollowing = account.following.get(req.params.user);

                    if (isFollowing != true) {
                        res.send({ status: "success", following: false });
                    } else {
                        res.send({ status: "success", following: true });
                    }



                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
    });

});

userRoutes.route('/fromFollowing').get(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    if (!account.following) {
                        account.following = {};
                        account.save();
                    }

                    var keys = 0;
                    for (const username of account.following.keys()) {
                        keys += 1;
                    }

                    var anotherPromise = new Promise(function (resolve) {
                        var retPosts = [];
                        for (const username of account.following.keys()) {
                            console.log(account.following.get(username));
                            if (account.following.get(username) == true) {
                                var promise = new Promise(function (resolve) {
                                    Post.find({ user: username }, function (err, data) {
                                        resolve(data);
                                    });
                                });

                                promise.
                                    then(function (posts) {
                                        retPosts = retPosts.concat(posts);
                                        keys -= 1;
                                        if (keys == 0) {
                                            resolve(retPosts);
                                        }
                                    });


                            } else {
                                keys -= 1;
                                if (keys == 0) {
                                    resolve(retPosts);
                                }
                            }
                        }

                    });
                    anotherPromise.then(function (posts) {
                        res.send(posts);
                    });





                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
    });

});

chatRoutes.route('/getFromUser/:user').get(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send('invalid authentication token!');
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    var messages = data[0].messages;
                    var newMessages = [];
                    for (var i = 0; i < messages.length; i++) {
                        if (messages[i].fromUser == req.params.user) {
                            newMessages.push(messages[i]);
                        }
                        if (i == messages.length - 1) {
                            res.send({ Status: 'success', message: newMessages });
                            return;
                        }
                    }
                    res.send({ Status: 'error' });

                } else {
                    res.send('invalid authentication token!');
                }
            });
        }
    });

});

chatRoutes.route('/getMessages').get(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send({Status:'error',message:'invalid authentication token!'});
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    res.send({ Status: 'success', messages: data[0].messages });

                } else {
                    res.send({Status:'error',message:'invalid authentication token!'});
                }
            });
        }
    });

});

userRoutes.route('/whoamI').get(function (req, res) {
    Account.find({ user: req.cookies['username'] }, function (err, data) {
        if (data.length == 0) {
            res.send({ status: 'error' });
        } else {
            var account = data[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    res.send({ status: 'Success', username: account.user });
                } else {
                    res.send({ status: 'error' });
                }
            });
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
    Account.find({ user: username }, function (err, data) {

        if (err) {
            console.log(err);
            return;
        }

        if (data.length == 0) {
            var jsonObj = { "status": "User Not Found" }
            res.status(404).json(jsonObj);
        }
        else {
            //This means the user has to exist
            Post.find({ user: username }, function (err, posts) {
                res.json({ "status": "Success", "posts": posts });
            });
        }




    }


    )

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
                    var responseObj = { updateType: "post", post: post };
                    post.save();
                    res.send('post added!');

                    io.to(req.params.id).emit('update', responseObj);
                    io.to('homepage').emit('update', responseObj);
                    io.to(account.user).emit('update', responseObj);
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
                            accounts[0].save().then( function(){
                                res.cookie('authToken', token, { maxAge: 30 * 60000,httpOnly:false });
                                res.cookie('username', accounts[0].user, { maxAge: 30 * 60000,httpOnly:false });
                                res.send('login correct');
                            });
                            
                        });
                        
                    });

                } else {
                    res.send('login incorrect');
                }
            });

        }

    })


});
userRoutes.route('/logout').get(function (req, res) {
    if (!req.cookies['username']) {
        res.status(400).json({
            "status": "error",
            "message": "You're not logged in!"
        });
        return;
    }
    Account.find({ user: req.cookies['username'] }, function (err, accounts) {
        if (err) {
            console.log(err);
            return;
        }

        if (accounts.length == 0) {
            res.status(400).json({
                "status": "error",
                "message": "could not find user " + req.cookies['username']
            });
            console.log('could not find user:' + req.cookies['username']);
        } else {
            var account = accounts[0];
            bcrypt.compare(req.cookies['authToken'], account.authSession, function (err, result) {
                if (result) {
                    res.clearCookie('username')
                    res.clearCookie('authtoken')
                    res.json({ "status": "Success" });
                } else {
                    res.status(400).json({
                        "status": "error",
                        "message": "invalid authentication token!"
                    });

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
                            var commentObj = { user: account.user, text: req.body.text };
                            post.comments.push(commentObj);

                            post.save().then(post => {
                                res.json(commentObj);
                                var responseObj = { id: req.params.id, updateType: "comment", comment: commentObj };
                                io.to(req.params.id).emit('update', responseObj);
                                io.to('homepage').emit('update', responseObj);
                                io.to(account.user).emit('update', responseObj);

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

                            if (voter == 'upvote') {
                                post.votes -= 1;
                                post.voters.set(account.user, 'neutral');
                                res.status(200).send("unupvote!");
                            } else {
                                post.votes += 1;
                                post.voters.set(account.user, 'upvote');
                                res.status(200).send("upvote successful");
                            }
                            post.save();
                            var responseObj = { id: req.params.id, updateType: "vote", vote: post.votes, voters: post.voters };
                            io.to(req.params.id).emit('update', responseObj);
                            io.to('homepage').emit('update', responseObj);
                            io.to(account.user).emit('update', responseObj);
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

                            if (voter == 'downvote') {
                                post.votes += 1;
                                post.voters.set(account.user, 'neutral');
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



server.listen(PORT, function () {
    console.log("Server is running on Port: " + PORT);
});