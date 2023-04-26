const express = require("express");

let router = express.Router();

let database = [];
let id = 100;

// REST API

// Fetch the whole shopping list
router.get("/shopping", function(req, res) {
    // User sees only his OWN database items!
    let tempDatabase = database.filter(item => item.user === req.session.user);
    return res.status(200).json(tempDatabase);
});

// Add a new shopping item
router.post("/shopping", function(req, res) {
    let item = {
        "type": req.body.type,
        "count": req.body.count,
        "price": req.body.price,
        "id": id,
        "user": req.session.user
    }
    id++;  // emulate unique key
    database.push(item);
    return res.status(201).json(item);
});

// Delete a shopping item
router.delete("/shopping/:id", function(req, res) {
    let tempId = parseInt(req.params.id, 10);
    for (let i=0; i<database.length; i++) {
        if (database[i].id === tempId) {
            if (database[i].user === req.session.user) {
                // Delete i'th element
                database.splice(i, 1);
                return res.status(200).json({"Message": "Success"});
            }
        }
    }
    return res.status(404).json({"Message": "Not found"});
})

// Change a shopping item
router.put("/shopping/:id", function(req, res) {
    let tempId = parseInt(req.params.id, 10);
    let item = {
        "type": req.body.type,
        "count": req.body.count,
        "price": req.body.price,
        "id": tempId,
        "user": req.session.user
    }
    for (let i=0; i<database.length; i++) {
        if (database[i].id === tempId) {
            if (database[i].user === req.session.user) {
                // Delete i'th element and replace with item
                database.splice(i, 1, item);
                return res.status(200).json({"Message": "Success"});
            }
        }
    }
    return res.status(404).json({"Message": "Not found"});
})

module.exports = router;