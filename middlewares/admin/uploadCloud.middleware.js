const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')//là một thư viện phổ biến được sử dụng để tạo luồng từ dữ liệu như mảng, chuỗi hoặc bất kỳ loại dữ liệu nào khác có sẵn trong Node.js.

// Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,// chuyên thông tin dưới mã nguồn 
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});
// End Cloudinary


//hàm middleware trong Express.js 
module.exports.upload = (req, res, next) => {
  //Nhiệm vụ của nó là kiểm tra xem có tệp nào được tải lên không. 
  if (req.file) {

    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        //tạo một luồng từ tệp đó và tải lên lên Cloudinary bằng cách
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      // khi tải lên thành công gán lại URL vào thẻ
      req.body[req.file.fieldname] = result.url;
      next();
    }
    // tải lên 
    upload(req);
  } else {
    next();
  }
}