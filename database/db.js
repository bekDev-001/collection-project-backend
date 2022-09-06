const {mongoose} = require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.MONGODB || "mongodb://localhost:27017/task-app" || process.env.MONGODB, {useNewUrlParser: true})
    .then(() => {
    console.log("Database connected successfully")
}).catch((e) => {
    console.log(e)
})

module.exports = mongoose;