const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
});
const restaurantController = require("../../controllers/RestaurantController");
const authentication = require("../../middleware/authenticate");
const authorization = require("../../middleware/authorization");
const router = express.Router();
// const authorization = require("../../middleware/authorization")

// router.get("/now-showing", restaurantController.getNowShowing);
router.get("/pub", restaurantController.getCuisines);
router.get("/pub/:id", restaurantController.getCuisineById);
router.use(authentication);
router.post("/", restaurantController.postCuisine);
router.put("/:id", authorization, restaurantController.updateCuisine);
router.delete("/:id", authorization, restaurantController.deleteCuisine);
router.patch("/:id/name", authorization, restaurantController.patchCuisineById);
router.patch("/:id/imgUrl", authorization, upload.single("avatar"), restaurantController.patchImgCuisineById);
/** upload single ini merupakan package yang bisa membuat user upload file */
module.exports = router;
