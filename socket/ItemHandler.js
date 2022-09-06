const Items = require("../models/ItemModel")
const Comments = require("../models/CommentModel")

module.exports = (socket) => {
    const likeItem = async (itemId, result) => {
        try {
            const {user} = socket?.user;

            if(!itemId) return result(undefined, {
                error: "Bad request",
                reason: "Item ID not provided"
            })

            const isLikeExist = await Items.find({_id: itemId, likes: user._id})
            if(isLikeExist.length > 0) return result(undefined, {
                error: "You already liked item"
            })

            const likedItem = await Items.findOneAndUpdate({_id: itemId}, {$push: {
                likes: user._id
            }}, {new: true})

            if(!likedItem) return result(undefined, {
                error: "Not found",
                reason: "Item not found following itemId: " + itemId
            })

            result({
                ok: true,
                message: "Item liked successfully",
                likedItem
            }, undefined)

        } catch (e) {
            result(undefined, {
                ok: false,
                message: "Error while liking item"
            })
        }
    }

    const dislikeItem = async (itemId, result) => {
        try {
            const {user} = socket?.user;
            if(!itemId) return result(undefined, {
                message: "Bad request",
                reason: "Itemid not provided"
            })

            const isItemDisliked = await Items.find({_id: itemId, likes: user._id})
            if(isItemDisliked.length === 0) return result(undefined, {
                message: "You already disliked item"
            })

            const dislikedItem = await Items.findOneAndUpdate({_id: itemId}, {$pull: {likes: user._id}}, {new: true})
            if(!dislikedItem) return result(undefined, {
                message: "Not Found",
                reason: "There is no item following id: " + itemId
            })

            result({
               ok: true,
               message: "You disliked item",
               dislikedItem
            }, undefined)


        } catch (e) {
            result(undefined, {
                ok: false,
                message: "Error while disliking item"
            })
        }
    }

    const commentToItem = async ({item_id, comment}, result) => {
        try{
            const {user} = socket?.user;
            const errors = []

            if(!item_id) {
                errors.push("item_id is required")
            }
            if(!comment) {
                errors.push("Comment body cannot be empty")
            }

            if(errors.length > 0) return result(undefined, {
                message: "Bad request",
                reason: errors
            })

            const commentDoc = new Comments({
                comment,
                comment_owner: user._id,
                comment_item: item_id
            })

            const savedComment = await commentDoc.save()

            if(!savedComment) return result(undefined, {
                message: "Internal server error",
                reason: "There is an error while creating comment"
            })

            const commentedItem = await Items.findOneAndUpdate({_id: item_id}, {$push: {comments: savedComment._id}}, {new: true})

            const itemComments = await Comments.find({comment_item: item_id}).populate({
                path: "comment_owner",
                select: "_id username email"
            })

            if(!commentedItem) return result(undefined, {
                message: "Not found",
                reason: "Item not found following item_id: " + item_id
            })

            socket.broadcast.emit("comment:received", {comments: itemComments})

            result({
                ok: true,
                message: "Comment created",
                savedComment,
                commentedItem
            }, undefined)

        } catch (e) {
            result(undefined, {
                ok: false,
                message: "Internal server error",
                reason: e
            })
        }
    }

    const getItemComments = async (item_id, callback) => {
        try {
           const item_comments = await Comments.find({comment_item: item_id}).populate("comment_owner").sort({
               $natural: -1
           })

           callback({
               comments: item_comments
           }, undefined)
        } catch (e) {
            callback(undefined, {
                message: "error",
                reason: e
            })
        }
    }

    const getReactions = async (item_id, callback) => {
        try {
            const {likes} = await Items.findOne({_id: item_id}).select("likes")

            if(!likes.length) return callback(undefined, {message: "Not found", reason: "Item not found following ID"})

            callback({message: "likes", likes})
        } catch (e) {
            callback(undefined, {message: "internal server error", reason: e})
        }
    }

    //EVENT LISTENER: LIKE ITEM
    socket.on("item:like", likeItem)

    //EVENT LISTENER: DISLIKE ITEM
    socket.on("item:dislike", dislikeItem)

    //EVENT LISTENER: COMMENT TO ITEM
    socket.on("item:comment", commentToItem)

    //EVENT EMITTER: GET COMMENTS
    socket.on("comment:all", getItemComments)

    //EVENT LISTENER: GET LIKES
    socket.on("likes:all", getReactions)
}