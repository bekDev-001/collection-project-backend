const Items = require("../models/ItemModel")
const Collections = require("../models/CollectionModel")
const Comments = require("../models/CommentModel")

const GlobalCtrl = {
    searchGlobal: async (req, res) => {
        try{
            const {searchTerm} = req.query;
            if(!searchTerm) return res.status(400).json({
                message: "Bad request",
                reason: "searchTerm should be provided as query params"
            })
            const result = []

            const foundCollections = await Collections.find({
                $text: {
                    $search: searchTerm,
                    $caseSensitive: false,
                    $diacriticSensitive: true
                }
            })

            const foundItems = await Items.find({
                $text: {
                    $search: searchTerm,
                    $caseSensitive: false,
                    $diacriticSensitive: true
                }
            })

            const foundComments = await Comments.find({
                $text: {
                    $search: searchTerm,
                    $caseSensitive: false,
                    $diacriticSensitive: true
                }
            })

            if(foundCollections.length) {
                result.push({
                    type: "Collections",
                    result: foundCollections
                })
            }

            if(foundItems.length) {
                result.push({
                    type: "Items",
                    result: foundItems
                })
            }

            if(foundComments.length) {
                result.push({
                    type: "Comments",
                    result: foundComments
                })
            }

            if(!result.length) return res.json({
                message: "Not found",
                result
            })

            res.json({
                message: "Matched search term",
                result
            })
        } catch (e) {
            res.status(500).json({
                message: "Internal server error",
                reason: e
            })
        }
    }
}

module.exports = GlobalCtrl