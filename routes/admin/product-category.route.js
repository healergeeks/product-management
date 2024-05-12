const express = require("express");
const multer = require("multer");
const router = express. Router();

const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const controller = require("../../controllers/admin/product-category.controller");
const validate = require("../../validates/admin/product-category.validate");

const upload = multer()

router.get("/", controller.index);

router.get("/create", controller.create);

router.post("/create", upload.single("thumbnail"), uploadCloud.upload, validate.createPost, controller.createPost);

router.patch("/change-multi", controller.changeMulti);

router.patch("/change-status/:status/:id", controller.changeStatus);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",upload.single("thumbnail"),validate.createPost,uploadCloud.upload,controller.editPatch);

router.get("/detail/:id", controller.detail);

router.delete("/delete/:id", controller.deleteItem);

module.exports = router;