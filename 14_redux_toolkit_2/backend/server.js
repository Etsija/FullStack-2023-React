const express = require("express");

let app = express();

app.use(express.json());

// DATABASE (in-memory mockup so far)

let database = [];
let id = 100;
let port = process.env.PORT || 3001;

// REST API

// Fetch the whole shopping list
app.get("/api/shopping", function(req, res) {
    return res.status(200).json(database);
});

// Add a new shopping item
app.post("/api/shopping", function(req, res) {
    let item = {
        "type": req.body.type,
        "count": req.body.count,
        "price": req.body.price,
        "id": id
    }
    id++;  // emulate unique key
    database.push(item);
    return res.status(201).json(item);
});

// Delete a shopping item
app.delete("/api/shopping/:id", function(req, res) {
    let tempId = parseInt(req.params.id, 10);
    let tempDatabase = database.filter(item => item.id !== tempId);
    database = tempDatabase;
    return res.status(200).json({"Message": "Success"});
})

// Change a shopping item
app.put("/api/shopping/:id", function(req, res) {
    let tempId = parseInt(req.params.id, 10);
    let item = {
        "type": req.body.type,
        "count": req.body.count,
        "price": req.body.price,
        "id": tempId
    }
    for (let i=0; i<database.length; i++) {
        if (database[i].id === tempId) {
            // Delete i'th element and replace with item
            database.splice(i, 1, item);
            return res.status(200).json({"Message": "Success"});
        }
    }
    return res.status(404).json({"Message": "Not found"});
})

app.listen(port);
console.log("Running in port", port);