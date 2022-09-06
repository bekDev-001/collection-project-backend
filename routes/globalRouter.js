const router = require("express").Router()
const GlobalCtrl = require("../controller/GlobalController")

/* SEARCH COLLECTION, ITEM, COMMENT */
router.get("/search/all", GlobalCtrl.searchGlobal)

module.exports = router;