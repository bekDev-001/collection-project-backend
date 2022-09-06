const router = require("express").Router()
const {auth} = require("../middleware/auth")
const uploadStorage = require("../middleware/storage")
const ItemCtrl = require("../controller/ItemController")

/* CREATE NEW ITEM */
router.post("/create", auth, uploadStorage.single("itemImage"), ItemCtrl.createItem)

/* EDIT ITEM */
router.patch("/edit/:item_id", auth, uploadStorage.single("itemImage"), ItemCtrl.editItem)

/* DELETE ITEM BY ITEM_ID */
router.delete("/delete/one/:item_id", auth, ItemCtrl.deleteItem)

/* GET ALL ITEMS */
router.get("/all", ItemCtrl.getAllItems)

/* GET ONE ITEM BY ITEM_ID */
router.get("/one/:item_id", ItemCtrl.getOneItem)

/* GET USER CREATED OWN ITEMS*/
router.get("/created/all/:userId", auth, ItemCtrl.getUsersOwnCreatedItems)

module.exports = router;