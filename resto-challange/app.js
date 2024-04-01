require("dotenv").config();

if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const router = require("./routes");
const app = express();
const errorHandle = require("./middleware/errorHandler");

/******* body parser *********/
//ambil data dari www form website
app.use(express.urlencoded({ extended: false }));
//ambil data dari json
app.use(express.json());
app.use(router);
app.use(errorHandle);
//instalasi error handler taro sini

module.exports = app;
