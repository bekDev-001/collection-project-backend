const User = require("../controller/userController")
const router = require("express").Router();

/* USER SIGNUP */
router.post("/signUp", User.signUp)

/* USER LOGIN */
router.post("/signIn", User.login);


module.exports = router;