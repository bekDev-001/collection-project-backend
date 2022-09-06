const {userModel} = require("../models/UserModel")

module.exports = (socket) => {
    const editUserStatus = async (user_id, updateField, result) => {
        try {
            const editedUser = await userModel.findOneAndUpdate({_id: user_id}, {...updateField}, {new: true})

            if(!editedUser) return result(undefined, {
                message: "Not found",
                reason: `User not found following user_id: ${user_id}`
            })

            result({
                message: "Updated successfully",
                editedUser
            }, undefined)
        } catch (e) {
            result(undefined, {
                message: "Internal server error",
                reason: e
            })
        }
    }

    /* EVENT LISTENER */
    socket.on("role:update", editUserStatus)
}