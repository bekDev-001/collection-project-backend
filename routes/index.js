const express = require("express");
const router = express.Router();
const userRouter = require("./userRouter");
const collectionRouter = require("./collectionRouter")
const itemRouter = require("./itemRouter")
const globalRouter = require("./globalRouter")
const {auth} = require("../middleware/auth")

router.get("/", auth, (req, res) => {
    res.send("App running")
})

router.use("/user", userRouter);
router.use("/collection", collectionRouter)
router.use("/item", itemRouter)
router.use("/global", globalRouter)

module.exports = router;