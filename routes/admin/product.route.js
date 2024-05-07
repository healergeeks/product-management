const express = require("express");

const multer = require("multer");//cho phép xử lý dữ liệu đa phương tiện (multi-part), chẳng hạn như tệp được tải lên từ một biểu mẫu HTML. Điều này thường được sử dụng trong các ứng dụng web để cho phép người dùng tải lên hình ảnh, tệp âm thanh hoặc tệp khác.

const router = express.Router();

const storageMulter = require("../../helpers/storageMulter");

const upload = multer({ storage: storageMulter() });

const controller = require("../../controllers/admin/product.controller");

const validate = require("../../validates/admin/product.validate");

router.get("/", controller.index);

router.patch("/change-status/:status/:id", controller.changeStatus);
//Đối số :status và :id sẽ được trích xuất từ đường dẫn và truyền vào hàm xử lý.

router.patch("/change-multi", controller.changeMulti);

router.delete("/delete/:id", controller.deleteItem);

router.get("/create", controller.create);

router.post("/create", upload.single("thumbnail"), validate.createPost, controller.createPost);

router.get("/edit/:id", controller.edit);

router.patch("/edit/:id",upload.single("thumbnail"),validate.createPost,controller.editPatch);

router.get("/detail/:id", controller.detail);

module.exports = router; //để nó có thể được sử dụng và kết nối với ứng dụng chính.