const express = require("express");
const router = require("./routes/apiroute");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

let app = express();
app.use(express.json());

// LOGIN DATABASES

let registeredUsers = [];
let loggedSessions = [];
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
        return res.status(403).json({"Message": "Forbidden"});
    }
    for (let i=0; i<loggedSessions.length; i++) {
        if (req.headers.token === loggedSessions[i].token) {
            let now = Date.now();
            if (now > loggedSessions[i].ttl) {
                loggedSessions.splice(i,1);  // Remove the session if timeout
                return res.status(403).json({"Message": "Forbidden"});
            } else {
                loggedSessions[i].ttl = now + time_to_live_diff;
                // Create session
                req.session = {};
                req.session.user = loggedSessions[i].user;
                return next();
            }
        }
    }
}

// LOGIN API

// This is an address that is always accessible, since one must always be able to register
app.post("/register", function(req, res) {
    
    // Basic checks for request body, username and pw
    if (!req.body) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({"Message": "Bad request"});
    }

    // Username already in use?
    for (let i=0; i<registeredUsers.length; i++) {
        if (req.body.username === registeredUsers[i].username) {
            return res.status(409).json({"Message": "Username already in use"});
        }
    }

    bcrypt.hash(req.body.password, 14, function(err, hash) {
        if (err) {
            console.log(err);
            return res.status(500).json({"Message": "Internal server error"});
        }
        let user = {
            username: req.body.username,
            password: hash
        }
        console.log(user);
        registeredUsers.push(user);
        return res.status(201).json({"Message": "Register Success"});
    })
});

// This also is an address that is always accessible, since one must always be able to login
// NOTE: this is NOT secure way to login atm, as http:// login is not secured by a certificate.
// -> "let's encrypt" site: you can get a free certificate for your site/server
app.post("/login", function(req, res) {
    
    // Basic checks for request body, username and pw
    if (!req.body) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (!req.body.username || !req.body.password) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (req.body.username.length < 4 || req.body.password.length < 8) {
        return res.status(400).json({"Message": "Bad request"});
    }

    // If user authorized, then create the session key
    for (let i=0; i<registeredUsers.length; i++) {
        if (req.body.username === registeredUsers[i].username) {
            bcrypt.compare(req.body.password, registeredUsers[i].password, function(err, success) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({"Message": "Internal server error"});
                }
                if (!success) {
                    return res.status(401).json({"Message": "Unauthorized"});
                }
                
                // Login successful
                let token = createToken();
                let now = Date.now();
                let session = {
                    user: req.body.username,
                    token: token,
                    ttl: now + time_to_live_diff
                }
                loggedSessions.push(session);
                return res.status(200).json({"token": token});
            })
            // This return is needed because bcrypt.compare() is an asynchronic function
            return;
        }
    }
    return res.status(401).json({"Message": "Unauthorized"});
});

// Logout
app.post("/logout", function(req, res) {
    if (!req.headers.token) {
        return res.status(404).json({"Message": "Not found"});
    }
    for (let i=0; i<loggedSessions.length; i++) {
        if (loggedSessions[i].token === req.headers.token) {
            // Remove this session
            loggedSessions.splice(i, 1);
            return res.status(200).json({"Message": "Logged out"});
        }
    }
    return res.status(404).json({"Message": "Not found"});
})

// Router (in "apiroute.js") watches for all back-end's routes that begin with "/api"
app.use("/api", isUserLogged, router);

app.listen(port);
console.log("Running in port", port);