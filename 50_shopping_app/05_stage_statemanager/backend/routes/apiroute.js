const express = require("express");
const itemModel = require("../models/item");

let router = express.Router();

// REST API

// Fetch the whole shopping list
router.get("/shopping", function(req, res) {
    // User sees only his OWN database items!
    let query = {"user": req.session.user};

    // Search functionality
    if (req.query.type) {
        query.type = req.query.type;
    }

    itemModel.find(query).then(function(items) {
        return res.status(200).json(items);
    }).catch(function(err) {
        console.log("Failed finding items, reason", err);
        return res.status(500).json({"Message": "Internal server error"});
    })
});

// Add a new shopping item
router.post("/shopping", function(req, res) {
    if (!req.body) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (!req.body.type) {
        return res.status(400).json({"Message": "Bad request"});
    }
    let item = new itemModel({
        "type": req.body.type.toLowerCase(),
        "count": req.body.count,
        "price": req.body.price,
        "user": req.session.user
    })
    item.save()
        .then(function(item) {
            return res.status(201).json(item);
        })
        .catch(function(err) {
            console.log("Failed to save new item, reason", err);
            return res.status(500).json({"Message": "Internal server error"});
        })
});

// Delete a shopping item
router.delete("/shopping/:id", function(req, res) {
    itemModel.deleteOne({"_id": req.params.id, "user": req.session.user})
        .then(function() {
            return res.status(200).json({"Message": "Success"});
        })
        .catch(function(err) {
            console.log("Failed to remove item id " + req.params.id + ", reason ", err);
            return res.status(500).json({"Message": "Internal server error"});
        })
})

// Change a shopping item
router.put("/shopping/:id", function(req, res) {
    if (!req.body) {
        return res.status(400).json({"Message": "Bad request"});
    }
    if (!req.body.type) {
        return res.status(400).json({"Message": "Bad request"});
    }
    let item = {
        "type": req.body.type.toLowerCase(),
        "count": req.body.count,
        "price": req.body.price,
        "user": req.session.user
    }
    itemModel.replaceOne({"_id": req.params.id, "user": req.session.user}, item)
        .then(function() {
            return res.status(200).json({"Message": "Success"});
        })
        .catch(function(err) {
            console.log("Failed to edit item id " + req.params.id + ", reason ", err);
            return res.status(500).json({"Message": "Internal server error"});
        })
})

module.exports = router;