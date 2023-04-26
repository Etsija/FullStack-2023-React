const mongoose = require("mongoose");

let Schema = mongoose.Schema({
    user: {type: String, index: true},
    type: String,
    count: Number,
    price: Number
})

// Creates a virtual variable "id" for this schema so that front-end doesn't need to be changed everywhere,
// because it uses "id" instead of "_id" that MongoDB uses
Schema.virtual("id").get(function() {
    return this._id
})

module.exports = mongoose.model("Item", Schema);