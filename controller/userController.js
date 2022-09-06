const {userModel} = require("../models/UserModel")
const validator = require("validator")
const {makeHashedPassword, checkPassword} = require("../lib/bcrypt");
const {signUser} = require("../lib/jwt");

const User = {
    signUp: async(req, res) => {
        try {
            const requiredInputs = []
            req.body.password = await makeHashedPassword(req.body.password)

            if(req.body) {
                if(!req.body.username) {
                    requiredInputs.push("Username is required")
                } else if(!req.body.password) {
                    requiredInputs.push("Password is required")
                } else if (!req.body.email) {
                    requiredInputs.push("Email is required")
                } else if (req.body.email && !validator.isEmail(req.body.email)) {
                    requiredInputs.push("Email is invalid")
                }
            }

            if(requiredInputs.length) {
                return res.status(400).json({
                    message: "Validation error",
                    requiredInputs
                })
            }

            const isUserExistUsername = await userModel.exists({username: req.body.username })
            const isUserExistEmail = await userModel.exists({email: req.body.email})

            if(isUserExistUsername) {
                return res.status(500).json({
                    message: `User exists following username: ${req.body.username}`
                })

            } else if (isUserExistEmail) {
                return res.status(500).json({
                    message: `User exists following email: ${req.body.email}`
                })
            }


            const user = new userModel({
                username: req.body.username,
                password: req.body.password,
                email: req.body.email,
                lastLogin: new Date().getTime(),
                registrationDate: new Date().getTime(),
            })

            const savedUser = await user.save()

            if(!savedUser) return res.status(500).json({
                status: 500,
                message: "Error while creating user"
            })
            res.status(201).json({
                status: 201,
                message: "User created successfully"
            })
        } catch (e) {

            res.json({
                error: e
            })
        }
    },

    login: async (req, res) => {
        try {
            const {username, password, email} = req.body;

            if(!username && !password) return res.status(400).json({
                message: "Bad request, username and password are required"
            })

            const foundUser = await userModel.findOne({username: username})

            if(!foundUser) return res.status(404).json({
                message: `User not found following username: ${username}`
            })

            const isPasswordMatch = await checkPassword(foundUser.password, password)

            if(!isPasswordMatch) return res.status(500).json({
                message: "Password does not match"
            })

            const loggedInUser = await userModel.findByIdAndUpdate(foundUser._id, { $set: {lastLogin: Date.now()}})

            const decodedUser = await signUser(loggedInUser)

            res.status(200).json({
                user: loggedInUser,
                token: decodedUser,
                message: "Successfully logged in"
            })

        } catch (e) {
            console.log(e)
            res.status(500).send({
                error: e
            })
        }

    }
}

module.exports = User