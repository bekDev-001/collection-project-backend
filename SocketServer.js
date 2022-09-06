const registerItemHandler = require("./socket/ItemHandler")
const registerUserHandler = require("./socket/UserHandler")

const Socket = (socket) => {
    registerItemHandler(socket)
    registerUserHandler(socket)
}

module.exports = Socket