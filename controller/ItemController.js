const Items = require("../models/ItemModel")
const Collection = require("../models/CollectionModel")

const ItemCtrl = {
    createItem: async (req, res) => {
        try {
            const errors = []
            const {itemTitle, description, itemTag} = req.body;
            const {user} = req.user;
            const image = req?.file?.path;
            const collectionId = req?.query?.collectionId

            if (!itemTitle || !itemTitle.length) {
                errors.push("Title required, but got no value")
            }

            if (!user._id) {
                errors.push("Could not get item creator ID")
            }

            if (!collectionId) {
                errors.push("You should provide collectionId as query value")
            }

            if (errors.length) return res.status(400).json({
                message: "Bad request", reason: errors
            })

            const item = new Items({
                itemTitle,
                description,
                itemTag,
                itemImage: image ? image : null,
                item_owner: user._id,
                itemCollection: collectionId,
                created_time: new Date().getTime()
            })

            const savedItem = await item.save()

            if (!savedItem) return res.status(500).json({
                message: "Error while creating item"
            })

            const updateCollection = await Collection.updateOne({_id: savedItem.itemCollection}, {$push: {collection_items: savedItem._id}})

            if(!updateCollection) {
                return res.status(500).json({
                    message: "Error while creating item",
                    reason: "Cannot update collection_items in Collection model"
                })
            }

            res.status(200).json({
                item: savedItem, success: true, message: "Item created successfully"
            })


        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    },

    editItem: async (req, res) => {
        try {
            const {item_id} = req.params;
            const {user} = req.user;
            const errors = []
            const allowedFields = ["itemTitle", "itemTag", "itemImage", "description"]
            const isValidField = allowedFields.some(field => Object.keys(req.body).includes(field))

            if(!isValidField) {
                errors.push("Allowed fields: itemTitle, itemTag, itemImage, description")
            }

            if(!Object.keys(req.body).length) {
                errors.push("Body should include at least one field")
            }

            if(errors.length > 0) return res.status(400).json({
                message: "Bad request",
                reason: errors
            })

            const editedItem = await Items.findOneAndUpdate({_id: item_id, item_owner: user._id}, {...req.body}, {new: true})

            if(!editedItem) return res.status(404).json({
                message: "Not found",
                reason: "Could not find item following item_id " + item_id
            })

            res.json({
                message: "Edited successfully",
                editedItem
            })

        } catch (e) {
            res.json({
                message: "Internal server error",
                reason: e
            })
        }
    },

    deleteItem: async (req, res) => {
        try {
            const {item_id} = req.params;
            const {user} = req.user;

            const deletedItem = await Items.findOneAndDelete({_id: item_id, item_owner: user._id})
            if(!deletedItem) return res.status(404).json({
                message: "Not found",
                reason: `Item not found following item_id: ${item_id} or item_owner: ${user._id}`
            })

            res.json({
                message: "Deleted successfully",
                deletedItem
            })
        } catch (e) {
            res.status(500).json({
                message: "Internal server error",
                reason: e
            })
        }
    },

    getAllItems: async (req, res) => {
        try {
            const {page = 1, limit = 10} = req.query;

            const items = await Items.find()
                .populate({
                    path: "item_owner", select: "_id username email"
                }).populate({
                    path: "itemCollection", select: "-collection_owner -collectionImage"
                }).populate({
                    path: "likes", select: "_id username email"
                }).populate({
                    path: "comments",
                    populate: {path: "comment_owner", select: "username _id"}
                }).sort({$natural: -1}).limit(limit * 1).skip((page - 1) * limit)

            if(!items.length) return res.status(404).json({
                message: "Items not found, create new one.",
                items
            })

            const totalCount = await Items.countDocuments()

            res.status(200).json({
                items,
                total_count: totalCount,
                currentPage: page
            })


        } catch (e) {
            res.status(500).json({
                error: e,
                message: "Internal server error"
            })
        }
    },

    getOneItem: async (req, res) => {
        try {
            const {item_id} = req.params;
            if(!item_id) return res.status(400).json({
                message: "Bad request",
                reason: "Item ID should be provided"
            })

            const item = await Items.findOne({_id: item_id}).populate({
                path: "item_owner",
                select: "_id username email"
            }).populate({
                path: "itemCollection",
                select: "title collectionTopic collectionImage description"
            }).populate({
                path: "likes", select: "_id username email"
            }).populate({
                path: "comments",
                populate: {path: "comment_owner", select: "username _id"}
            })

            if(!item) return res.status(404).json({
                message: "Not found",
                reason: "Item not found following ITEM_ID: " + item_id
            })

            res.json({
                item
            })
        } catch (e) {
            res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    getUsersOwnCreatedItems: async(req, res) => {
        try {
            const userId = req?.params?.userId

            if(!userId) return res.status(400).send({
                message: "USER ID is required as param"
            })

            const items = await Items.findOne({item_owner: userId}).populate({
                path: "item_owner",
                select: "_id username email"
            }).populate({
                path: "itemCollection",
                select: "title collectionTopic collectionImage description"
            }).populate({
                path: "likes", select: "_id username email"
            }).populate({
                path: "comments",
                populate: {path: "comment_owner", select: "username _id"}
            })

            if(!items) return res.status(404).send({
                message: "This user has no created items yet"
            })

            res.status(200).json({
                items
            })

        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "internal server error",
                error: e
            })
        }
    }
}

module.exports = ItemCtrl