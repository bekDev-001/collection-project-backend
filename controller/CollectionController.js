const Collection = require("../models/CollectionModel");
const Users = require("../models/UserModel")
const moment = require("dayjs")
const validator = require("validator")

const CollectionCtrl = {
    createCollection: async (req, res) => {
        try {
            const {title, collectionTopic, description} = req.body;
            const {user} = req.user;

            if(!title) {
                return res.status(400).json({
                    message: "Collection title required"
                })
            }

            const collection = new Collection({
                title,
                collectionTopic,
                description,
                collection_owner: user._id,
                collectionImage: req?.file?.path ? req.file.path : null,
                created_time: moment()
            })

            const collectionSaved = await collection.save()

            if(!collectionSaved) return res.status(500).json({
                message: "Error while creating collection"
            })

            res.status(200).json(collectionSaved)


        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "Internal server error"
            })
        }
    },

    editCollection: async (req, res) => {
        try {
            const {collection_id} = req.params;
            const {user} = req.user;
            const errors = []

            const allowedFields = ["title", "collectionTopic", "collectionImage", "description"]
            const isValidFields = allowedFields.some((fields) => Object.keys(req.body).includes(fields))

            if(!isValidFields) {
                errors.push("Allowed fields: title, collectionTopic, collectionImage, description")
            }
            if(!Object.keys(req.body).length) {
                errors.push("Body should include at least one editing field")
            }

            if(!collection_id) {
                errors.push("collection_id should be provided")
            }

            if(errors.length > 0) return res.status(400).json({
                message: "Bad request",
                reason: errors
            })

            const editedCollection = await Collection.findOneAndUpdate({_id: collection_id, collection_owner: user._id}, {...req.body}, {new: true})

            if(!editedCollection) return res.status(404).json({
                message: "Not found",
                reason: "Editing collection not found following collection_id" + collection_id
            })

            res.status(200).json({
                message: "Successfully edited",
                editedCollection
            })


        } catch (e) {
            console.log(e)
            res.status(500).json({
                message: "Internal server error",
                reason: e
            })
        }
    },

    deleteCollection: async (req, res) => {
      try {
          const {collection_id} = req.params
          const {user} = req.user;

          const deletedItem = await Collection.findOneAndDelete({_id: collection_id, collection_owner: user._id})

          if(!deletedItem) return res.status(404).json({
              message: "Not found",
              reason: `Collection not found following collection_id: ${collection_id} or collection_owner: ${user._id}`
          })

          res.json({
              message: "Deleted successfully",
              deletedItem
          })
      }  catch (e) {
          res.json({
              message: "Internal server error",
              reason: e
          })
      }
    },

    getAllCollection: async (req, res) => {
        try{
            const collections = await Collection.aggregate([
                { $addFields: { collection_items_count: { $size: "$collection_items"}}},
                { $sort: { collection_items_count: -1}},
                {
                    $lookup: {
                        from: "users",
                        localField: "collection_owner",
                        foreignField: "_id",
                        as: "collection_owner"
                    }
                }
            ])

            if(!collections.length) return res.status(404).json({
                collections,
                message: "Collection not found, create at least one"
            })

            res.status(200).json({
                collections
            })
        } catch(e) {
            console.log(e)
            res.status(500).json({
                message: "Internal server error",
                reason: e
            })
        }
    },

    getUserCreatedCollection: async (req, res) => {
        try {
            const userId = req?.params?.id

            if(!userId) return res.status(500).send({
                message: "Error, you should send USER ID as params"
            })

            const collections = await Collection.find({collection_owner: userId}).populate({path:"collection_owner", select: "-password"})

            if(!collections.length) return res.status(404).json({
                collections,
                message: "User has no collections yet"
            })

            res.status(200).json({
                collections
            })

        } catch(e) {
            if(e) return res.status(500).send({
                error: e,
                message: "Sent ID is invalid, must be 12 byte or 24 hex character, but got invalid string"
            })

        }
    },

    getOneCollection: async(req, res) => {
        try{
            const collectionId = req?.params?.id;

            if(!collectionId) return res.status(400).send({
                message: "You should provide COLLECTION ID as params id"
            })

            const collections = await Collection.find({_id: collectionId}).populate({
                path: "collection_owner", select: "-password"
            }).populate({
                path: "collection_items"
            })

            if(!collections.length) return res.status(404).send({
                collections,
                message: `No collection found following COLLECTION ID: ${collectionId}`
            })

            res.status(200).json({
                collections
            })

        } catch (e) {
            if(e) return res.status(500).send({
                error: e,
                message: "Sent ID is invalid, must be 12 byte or 24 hex character, but got invalid string"
            })
        }
    }


}

module.exports = CollectionCtrl