const express = require("express");
const mongoose = require("mongoose");

let app = express();

const mongo_url = process.env.MONGODB_URL;
const mongo_user = process.env.MONGODB_USER;
const mongo_pw = process.env.MONGODB_PW;

const url = "mongodb+srv://" 
            + mongo_user + ":"
            + mongo_pw + "@"
            + mongo_url + "/?retryWrites=true&w=majority";

mongoose.connect(url).then(
    () => console.log("Connected to MongoDB"),
    (error) => console.log("Failed to connect to MongoDB, reason:", error)
)

app.listen(5000);