const mongoose = require("mongoose")

const ItemSchema = new mongoose.Schema({
    itemTitle: {
        type: String,
        required: true
    },
    itemCollection: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "collections"
    },
    item_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    itemTag: {
        type: String,
        length: 200
    },
    itemImage: {
        type: String
    },
    description: {
        type: String
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users"
        }
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "comments"
        }
    ],

}, {
    timestamps: true
})

ItemSchema.index({"$**": "text", itemImage: -1})

const Items = mongoose.model("items", ItemSchema)

module.exports = Items;