const multer = require("multer")
const storage = require("../lib/storage")

const uploadStorage = multer({
    storage: storage
})

module.exports = uploadStorage;