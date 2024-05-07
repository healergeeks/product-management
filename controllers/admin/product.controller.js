const Product = require("../../models/porduct.model");

const filterStatusHelpers = require("../../helpers/filterStatus");

const searchHelpers = require("../../helpers/search");

const systemConfig = require("../../config/system");

const paginationHealper = require("../../helpers/pagination");

// [GET] /admin/products
module.exports.index = async (req, res) => {

  // trạng thái sản phẩm 
  const filterStatus = filterStatusHelpers(req.query);

  // bộ lọc tìm kiếm 
  const objectSearch = searchHelpers(req.query);

  let find = {
    deleted: false
  };

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  //req (request) trong Express.js, cho phép bạn truy cập các tham số được truyền trong URL thông qua phương thức GET. 
  // query là một object lưu trữ các các biến 

  // nếu có tìm kiếm thì mới chuyền vào find để truy vấn  
  if (req.query.status) {
    // lấy ra giá trị thuộc tính status được chuyền URL(req.query)
    find.status = req.query.status; //let find = { deleted: false, status= req.query.status}; 
  }

  // Pagination phẩn trang 
  const countProducts = await Product.countDocuments(find); //phương thức countDocuments() của model Product để đếm số lượng sản phẩm trong cơ sở dữ liệu phù hợp với điều kiện find.
  let objectPagination = paginationHealper(
    {
      currentPage: 1, //trang hiện tại
      limitItems: 4,  //giới hạn mục
    },
    req.query,
    countProducts,
  );
  // End Pagination


  //limit() được gọi để giới hạn số lượng sản phẩm được trả về trên mỗi trang, và skip() được sử dụng để bỏ qua các sản phẩm trước đó (với mục đích phân trang).
  const products = await Product.find(find).sort({ position: "desc" }).limit(objectPagination.limitItems).skip(objectPagination.skip);

  //find truy vấn cở sử dữ liệu với các điều kiện được chỉ định trong tham số find
  //const products = await Products.find(find);

  res.render("admin/pages/products/index", {

    pageTitle: "trang chủ",

    products: products, //sản phẩm

    filterStatus: filterStatus, // trang thái sản phẩm 

    keyword: objectSearch.keyword,// bộ lọc tìm kiếm 

    pagination: objectPagination,// phẩn trang
  });
}

//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

  const status = req.params.status; //req đường truyền, đường chuyền được dặt tên trong oj params tên là status
  const id = req.params.id;

  req.flash("success", "Cập nhật trạng thái thành công!");

  await Product.updateOne({ _id: id }, { status: status });//updateOne sửa đổi một sản phẩm theo ID

  res.redirect("back");//Sau khi hoàn tất thao tác cập nhật, mã sẽ chuyển hướng người dùng quay lại trang trước. 
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {

  const type = req.body.type;//type loạt hành động được gửi đi. mã lấy ra các tham số từ yêu cầu HTTP được gửi bởi client. 

  const ids = req.body.ids.split(", ");//split()phân tách bằng dấu phẩy và khoảng trắng ", ".

  switch (type) {
    case "active":// nếu type là "active", các sản phẩm tương ứng với các ID được cung cấp sẽ được cập nhật trạng thái thành "active" trong cơ sở dữ liệu.

      await Product.updateMany({ _id: { $in: ids } }, { status: "active" });

      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);

      break;
    case "inactive":

      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive" });

      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);

      break;
    case "delete-all"://nếu type là "delete-all" các sản phẩm sẽ được xoá và được lưu thời gian xoá 
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,
          deletedAt: new Date(),
        }
      );
      req.flash("success", `Dã xoá thành công ${ids.length} sản phẩm`);
      break;
    case "change-position"://nếu type là "change-position" mỗi phần tử trong danh sách ids sẽ chứa một cặp id-position. Mã sẽ phân tích mỗi cặp này ra và cập nhật vị trí của sản phẩm tương ứng với id.
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        console.log(id);
        // console.log(position);
        await Product.updateOne({ _id: id }, { position: position });
      }
      break;
    default:
      break;
  }
  res.redirect("back");
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {

  const id = req.params.id; // Điều này đặc biệt hữu ích khi yêu cầu xóa một mục cụ thể và ID của nó được chuyển trực tiếp qua URL.

  //updateOne() để cập nhật mục đó trong cơ sở dữ liệu
  await Product.updateOne({ _id: id }, {
    deleted: true,//đã xóa bằng cách đặt thuộc tính deleted thành true
    daletedAt: new Date(),//ghi lại thời gian xóa 
  }); // xoá ở ngoài giao diện và vẫn còn trong database sau có thể mở rộng thêm sản phẩm đã xoá và có thể khôi phục
  req.flash("success", `Dã xoá thành công sản phẩm`);
  // await Product.deleteOne({ _id: id });// xoá thẳng ở trong database
  res.redirect("back");
};

// [GET] /admin/products/create 
module.exports.create = async (req, res) => {
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
  })
};

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  //được chuyền dữ liệu thông qua from nên webs và lấy về thông qua req.body

  // chuyển đổi kiểu dữ liệu 
  req.body.price = parseInt(req.body.price);

  req.body.discountPercentage = parseInt(req.body.discountPercentage);

  req.body.stock = parseInt(req.body.stock);

  //nếu vị trí được xắc định
  if (req.body.position == "") {
    //đếm số lượng sản phẩm hiện có trong cở sở dữ liệu 
    const countProducts = await Product.countDocuments();
    // gán cho vị trị sản phẩm mới và cộng thêm 1
    req.body.position = countProducts + 1;
  } else {
    // chuyển đổi kiểu dữ liệu 
    req.body.position = parseInt(req.body.position);
  }
  
  const product = new Product(req.body);//tạo ra một sản phẩm được chuyền lên web 
  await product.save();//sau đó lưu vào cở sở dữ liệu save()
  res.redirect(`${systemConfig.prefixAdmin}/product`);// sau khi lưu thành công và chuyển hướng đến một trang khác 
};

// [GET] /admin/products/edit/:id 
module.exports.edit = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const product = await Product.findOne(find);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/product`);
  }

};

// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);
  if (req.file) {
    req.body.thumbnail = `/uploads/${req.file.filename}`;
  }
  try {
    await Product.updateOne({ _id: id }, req.body);
    req.flash("success", `Cập nhật thành công!`);
  } catch (error) {
    req.flash("error", `Cập nhật thất bại!`);
  }
  res.redirect("back");
};

// [GET] /admin/products/edit/:id 
module.exports.detail = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/product`);
  }

};