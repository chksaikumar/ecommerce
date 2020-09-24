const express = require("express");
const { requireSignin, adminMiddleware } = require("../common-middleware");
const { createProduct } = require("../controller/product");
const multer = require("multer");
const router = express.Router();
const shortid = require("shortid");
const path = require("path");
//it is use multer liberary and diskstorage it will take to objects destination and filename
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploads")); //__dirname will give currentip of this file
  }, //path.join to join path
  filename: function (req, file, cb) {
    cb(null, shortid.generate() + "-" + file.originalname);
  }, //short.generate will generate random alphabits
});

const upload = multer({ storage }); //multer which is primarily used for uploading files

router.post(
  "/product/create",
  requireSignin,
  adminMiddleware,
  upload.array("productPicture"),
  createProduct
);

module.exports = router;
