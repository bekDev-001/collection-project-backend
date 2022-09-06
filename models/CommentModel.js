const mongoose = require("mongoose")

const CommentSchema = new mongoose.Schema({
    comment: {
        type: String
    },
    comment_owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users"
    },
    comment_item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "items"
    },
}, {
    timestamps: true
})

CommentSchema.index({"$**": "text"})

const Comments = mongoose.model("comments", CommentSchema)

module.exports = Comments;