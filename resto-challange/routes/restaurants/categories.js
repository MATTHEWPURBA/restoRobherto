const express = require("express");
const multer = require("multer");
const categoryController = require("../../controllers/CategoryController");
const authentication = require("../../middleware/authenticate");
const authorization = require("../../middleware/authorization");
const storage = multer.memoryStorage();
const upload = multer({
	storage: storage,
});
const router = express.Router();

router.get("/", categoryController.getCategory);
router.post("/", authentication, categoryController.postCategory);
router.put("/:id", authentication, categoryController.updateCuisine);

module.exports = router;
