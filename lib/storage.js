const cloudinary = require("cloudinary").v2
const {CloudinaryStorage} = require("multer-storage-cloudinary")

cloudinary.config({
    cloud_name: "broken",
    api_key: "363869126497253",
    api_secret: "PxrbSjOdiaxY_Cfe_0MRvFs0Shg"
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "uploads"
    }
})

module.exports = storage