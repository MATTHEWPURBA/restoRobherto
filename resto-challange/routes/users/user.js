const express = require("express");
const UserController = require("../../controllers/UserController");
const authentication = require("../../middleware/authenticate");
const adminOnly = require("../../middleware/adminOnly");
const router = express.Router();

//langsung post karena register membutuhkan data dari input user
router.post("/add-user", authentication, adminOnly, UserController.registerUser);
router.post("/login", UserController.loginUser);

module.exports = router;
