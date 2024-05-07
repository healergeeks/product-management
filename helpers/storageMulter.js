const multer = require("multer");//cho phép xử lý dữ liệu đa phương tiện (multi-part), chẳng hạn như tệp được tải lên từ một biểu mẫu HTML. Điều này thường được sử dụng trong các ứng dụng web để cho phép người dùng tải lên hình ảnh, tệp âm thanh hoặc tệp khác.

module.exports = () => {

  //đang tạo ra một storage engine (bộ lưu trữ) cho việc xử lý tải lên tệp tin trong ứng dụng Node.js bằng cách sử dụng thư viện multer.
  const storage = multer.diskStorage({

    //destination: Xác định thư mục đích mà tệp tin sẽ được lưu trữ. Trong trường hợp này, tất cả các tệp tin sẽ được lưu trữ trong thư mục ./public/uploads/.
    destination: function (req, file, cb) {
      cb(null, "./public/uploads/");
    },

    //filename: Xác định tên tệp tin sau khi được lưu trữ. Trong trường hợp này, tên tệp tin được đặt thành một chuỗi bao gồm timestamp hiện tại (Date.now()) và tên gốc của tệp tin (file.originalname), để đảm bảo tính duy nhất của tên tệp tin.
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now();
      cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
  });
  return storage;
};