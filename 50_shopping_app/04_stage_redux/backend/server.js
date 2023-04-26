const express = require("express");
const router = require("./routes/apiroute");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const userModel = require("./models/user");
const sessionModel = require("./models/session");

let app = express();
app.use(express.json());

// MONGOOSE CONNECTION

const mongo_url = process.env.MONGODB_URL;
const mongo_user = process.env.MONGODB_USER;
const mongo_pw = process.env.MONGODB_PW;

const url = "mongodb+srv://" 
            + mongo_user + ":"
            + mongo_pw + "@"
            + mongo_url + "/shoppingDatabase?retryWrites=true&w=majority";

//console.log(url);

mongoose.connect(url).then(
    () => console.log("Connected to MongoDB"),
    (error) => console.log("Failed to connect to MongoDB, reason:", error)
);

// This creates the "id"s matching "_id"s
mongoose.set("toJSON", {virtuals: true});

// Session length = 3600 s = 1 hour
const time_to_live_diff = 3600000;

let port = process.env.PORT || 3001;

// LOGIN MIDDLEWARE

// Session token
createToken = () => {
    let token = crypto.randomBytes(64);
    return token.toString("hex");
}

// This is the core of our security part!!!
isUserLogged = (req, res, next) => {
    if (!req.headers.token) {
        return res.status(403).json({"Message": "Forbidden 1"});
    }
    
    sessionModel.findOne({"token": req.headers.token}).then(function(session){
        if (!session) {
            return res.status(403).json({"Message": "Forbidden 2"});
        }
        let now = Date.now();
        if (now > session.ttl) {
            sessionModel.deleteOne({"_id": session._id}).then(function() {
                return res.status(403).json({"Message": "Forbidden 3"});
            }).catch(function(err) {
                console.log("Failed to remove session in isUserLogged, reason", err);
                return res.status(403).json({"Message": "Forbidden 4"});
            })
        } else {
            session.ttl = now + time_to_live_diff;
            req.session = {};
            req.session.user = session.user;
            session.save().then(function() {
                return next();
            }).catch(function(err) {
                console.log("Failed to update session in isUserLogged, reason", err);
                return next();
            })
        }
    }).catch(function(err) {
        console.log("Failed to find session in isUserLogged, reason", err);
        return res.status(403).json({"Message": "Forbidden 5"});
    })
}

// LOGIN API

// This is an address that is always accessible, since one must always be able to register
app.post("/register", function(req, res) {
    
    // Check request body
    if (!req.body) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({"Message": "Bad request"});
    }

    // Create a new user with a crypted password
    bcrypt.hash(req.body.password, 14, function(err, hash) {
        if (err) {
            console.log(err);
            return res.status(500).json({"Message": "Internal server error"});
        }

        // Save new user to database, using the userModel data model (which is defined in user.js)
        let user = new userModel({
            "username": req.body.username,
            "password": hash
        })
        user.save().then(function(user) {
            return res.status(200).json({"Message": "Register success"});
        }).catch(function(err) {
            if (err.code === 11000) {
                return res.status(409).json({"Message": "Username already in use"});
            }
            return res.status(500).json({"Message": "Internal server error"});
        })
    })
});

// This also is an address that is always accessible, since one must always be able to login
// NOTE: this is NOT secure way to login atm, as http:// login is not secured by a certificate.
// -> "let's encrypt" site: you can get a free certificate for your site/server
app.post("/login", function(req, res) {
    
    // Check request body
    if (!req.body) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({"Message": "Bad request"});
    }

    // Try to find a user matching the given credentials from the database
    userModel.findOne({"username": req.body.username}).then(function(user) {
        if (!user) {
            return res.status(401).json({"Message": "Unauthorized"});
        }
        bcrypt.compare(req.body.password, user.password, function(err, success){
            if (err) {
                console.log("Comparing passwords failed, reason", err);
                return res.status(500).json({"Message": "internal server error"});
            }
            if (!success) {
                return res.status(401).json({"Message": "Unauthorized"});
            }

            // User found -> create a session to the database
            let token = createToken();
            let now = Date.now();
            let session = new sessionModel({
                user: req.body.username,
                ttl: now + time_to_live_diff,
                token: token
            })
            session.save().then(function(session) {
                return res.status(200).json({"token": token})
            }).catch(function(err) {
                return res.status(500).json({"Message": "Internal server error"});
            })
        })
    }).catch(function(err) {
        return res.status(500).json({"Message": "Internal server error"});
    })
});

// Logout
app.post("/logout", function(req, res) {

    // Check request header
    if (!req.headers.token) {
        return res.status(404).json({"Message": "Not found"});
    }
    
    // Logout successful -> delete the session from the database
    sessionModel.deleteOne({"token": req.headers.token}).then(function() {
        return res.status(200).json({"Message": "Logged out"});
    }).catch(function(err) {
        console.log("Failed to remove session in logout, reason", err);
        return res.status(200).json({"Message": "Logged out"});
    })
})

// Router (in "apiroute.js") watches for all back-end's routes that begin with "/api"
app.use("/api", isUserLogged, router);

app.listen(port);
console.log("Running in port", port);