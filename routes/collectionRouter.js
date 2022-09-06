const router = require("express").Router()
const {auth} = require("../middleware/auth")
const uploadStorage = require("../middleware/storage")
const CollectionCtrl = require("../controller/CollectionController")

/* CREATE COLLECTION */
router.post("/create", auth, uploadStorage.single("collectionImage"), CollectionCtrl.createCollection)

/* EDIT COLLECTION */
router.patch("/edit/:collection_id", auth, uploadStorage.single("collectionImage"), CollectionCtrl.editCollection)

/* DELETED COLLECTION BY COLLECTION_ID */
router.delete("/delete/one/:collection_id", auth, CollectionCtrl.deleteCollection)

/* GET ALL COLLECTIONS */
router.get("/all", CollectionCtrl.getAllCollection)

/* GET USERS OWN COLLECTIONS */
router.get("/all/created/:id", auth, CollectionCtrl.getUserCreatedCollection)

/* GET ONE COLLECTION BY COLLECTION ID */
router.get("/one/:id", CollectionCtrl.getOneCollection)

module.exports = router