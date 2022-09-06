const {verifyUser} = require("../lib/jwt");
const {isEmpty} = require("validator")

const auth = async (req, res, next) => {
    try {
        const token = req.headers?.authorization?.replace("Bearer ", "")

        if(isEmpty(token)) return res.status(403).json({
            message: "Forbidden"
        })

        const user = await verifyUser(token)

        if(!user) return res.status(401).json({
            message: "Expired or invalid JWT token"
        })

        req.user = user;

        next()

    } catch(e) {
        if(e.name === "TokenExpiredError") return res.sendStatus(401)

        res.sendStatus(403)
    }
}

const socketAuth = async (socket, next) => {
    try {
        const token = socket.handshake?.auth?.token;
        if(!token) return next(new Error(JSON.stringify({
            message: "Unauthorized",
            reason: "Token not provided"
        })))

        const user = await verifyUser(token)
        if(!user) return next(new Error(JSON.stringify({
            message: "Forbidden",
            reason: "Token is invalid"
        })))

        socket.user = user;

        next()
    } catch (e) {
        if(e.message === "jwt malformed") {
            next(new Error(JSON.stringify({
                error: e,
                reason: "Invalid JWT token"
            })))
        }

    }
}

module.exports = {auth, socketAuth};