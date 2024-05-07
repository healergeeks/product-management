const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");// khai báo thư viện tạo ra đường dẫn URL(SLUG)

mongoose.plugin(slug);//là một phương thức được sử dụng để kích hoạt một plugin có tên là "slug".
//nếu bạn có một trường tên và muốn tạo ra một slug tương ứng cho mỗi tên, bạn có thể sử dụng plugin này để tự động tạo slug dựa trên giá trị của trường tên.

//Schema là khởi tạo bộ khung ánh xạ tới bộ sưu tập MongoDB và xác định hình dạng của tài liệu trong bộ sưu tập đó.
const productSchema = new mongoose.Schema({
  title: String,// tên sản phẩn 
  description: String,
  price: Number,
  discountPercentage: Number,
  stock: Number,
  thumbnail: String,
  status: String,
  position: Number,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  deleted: {//"deleted" là một trường boolean (true/false) với giá trị mặc định là false.
    type: Boolean,
    default: false,
  },
  daletedAt: Date,// theo dõi thời gian sửa đổi sản phẩm 
},{
  timestamps: true//thuộc tính "timestamps" với giá trị là true. Trong MongooseJS, điều này tạo ra hai trường bổ sung tự động: "createdAt" và "updatedAt", để theo dõi thời gian mà một bản ghi được tạo và cập nhật.
}
);

// model() lấy dữ liệu từ trong quan hệ
const Product = mongoose.model("Product", productSchema, "products");
/**mongoose.model: Đây là một phương thức trong thư viện Mongoose để định nghĩa một model. Nó nhận vào ba đối số:
Đối số đầu tiên ("Product"): Là tên của model.(bộ khung bộ dữ liệu )
Đối số thứ hai (productSchema): Là schema được sử dụng để định nghĩa cấu trúc của các tài liệu trong collection MongoDB tương ứng.
Đối số thứ ba ("products"): Là tên của collection(quan hệ) trong cơ sở dữ liệu MongoDB mà model này liên kết với. */
module.exports = Product;// xuất model vào tất cả các file bạn có thể import nó từ các file khác trong ứng dụng của bạn.