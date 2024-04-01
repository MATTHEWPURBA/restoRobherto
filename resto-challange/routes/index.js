const express = require("express");
const router = express.Router();
const userRoute = require("./users/user");
const restoRoute = require("./restaurants/restaurant");
const routeCategories = require("./restaurants/categories");

router.use("/restaurants", restoRoute);
router.use("/categories", routeCategories);
router.use("/users", userRoute);
module.exports = router;
