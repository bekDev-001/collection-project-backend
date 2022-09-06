const mongoose = require("mongoose")

const CollectionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    collectionTopic: {
        type: String,
    },
    collectionImage: {
        type: String
    },
    description: {
        type: String
    },
    collection_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    collection_items: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "items"
        }
    ]
}, {timestamps: true})

CollectionSchema.index({"$**": "text", "collectionImage": -1})

const Collection = mongoose.model("collections", CollectionSchema)

module.exports = Collection