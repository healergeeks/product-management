const Product = require("../../models/porduct.model");
const ProductCategory = require("../../models/product-category.model");
const Account = require("../../models/account.model");

const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/search");
const systemConfig = require("../../config/system");
const paginationHealper = require("../../helpers/pagination");
const createTreeHelper = require("../../helpers/createTree");

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

  // Sort
  let sort = {};

  //có chứa cả hai thuộc tính sortKey và sortValue không.
  if (req.query.sortKey && req.query.sortValue) {

    //trong oj thì hiểu trong ngoặc [..]là String. sort["name"] sẽ được gán "Value".
    sort[req.query.sortKey] = req.query.sortValue;
  } else {
    sort.position = "desc";
  }
  // End Sort

  //limit() được gọi để giới hạn số lượng sản phẩm được trả về trên mỗi trang, và skip() được sử dụng để bỏ qua các sản phẩm trước đó (với mục đích phân trang).
  const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);

  for (const product of products) {
    // lấy ra thông tin người tạo 
    const user = await Account.findOne({
      _id: product.createdBy.account_id
    });
    if (user) {
      product.accountFullName = user.fullName;
    }
    // lấy ra thông tin người cập nhập gần nhất 
    const updatedBy = product.updatedBy.slice(-1)[0]; if (updatedBy) {
      const userUpdated = await Account.findOne({
        _id: updatedBy.account_id
      });
    }
    updatedBy.accountFullName = userUpdated.fullName;
  }

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

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  req.flash("success", "Cập nhật trạng thái thành công!");

  await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } });//updateOne sửa đổi một sản phẩm theo ID

  res.redirect("back");//Sau khi hoàn tất thao tác cập nhật, mã sẽ chuyển hướng người dùng quay lại trang trước. 
}


// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {

  const type = req.body.type;//type loạt hành động được gửi đi. mã lấy ra các tham số từ yêu cầu HTTP được gửi bởi client. 

  const ids = req.body.ids.split(", ");//split()phân tách bằng dấu phẩy và khoảng trắng ", ".

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }
  switch (type) {
    case "active":// nếu type là "active", các sản phẩm tương ứng với các ID được cung cấp sẽ được cập nhật trạng thái thành "active" trong cơ sở dữ liệu.

      await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });

      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);

      break;
    case "inactive":

      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });

      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);

      break;
    case "delete-all"://nếu type là "delete-all" các sản phẩm sẽ được xoá và được lưu thời gian xoá 
      await Product.updateMany(
        { _id: { $in: ids } },
        {
          deleted: true,//đã xóa bằng cách đặt thuộc tính deleted thành true
          // daletedAt: new Date(),//ghi lại thời gian xóa 
          deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date(),
          }
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
        await Product.updateOne({ _id: id }, { position: position, $push: { updatedBy: updatedBy } });
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
    // daletedAt: new Date(),//ghi lại thời gian xóa 
    deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date(),
    }
  }); // xoá ở ngoài giao diện và vẫn còn trong database sau có thể mở rộng thêm sản phẩm đã xoá và có thể khôi phục
  req.flash("success", `Dã xoá thành công sản phẩm`);
  // await Product.deleteOne({ _id: id });// xoá thẳng ở trong database
  res.redirect("back");
};


// [GET] /admin/products/create 
module.exports.create = async (req, res) => {
  console.log(res.locals.user);
  let find = {
    deleted: false
  };
  const category = await ProductCategory.find(find);

  const Newcategory = createTreeHelper.tree(category);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: Newcategory,
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
  req.body.createdBy = {
    account_id: res.locals.user.id
  };
  const product = new Product(req.body);//tạo ra một sản phẩm được chuyền lên web 
  await product.save();//sau đó lưu vào cở sở dữ liệu save()
  res.redirect(`${systemConfig.prefixAdmin}/product`);// sau khi lưu thành công và chuyển hướng đến một trang khác 
};


// [GET] /admin/products/edit/:id 
module.exports.edit = async (req, res) => {

  try {
    const product = await Product.findOne({
      deleted: false,
      _id: req.params.id
    });
    const category = await ProductCategory.find({
      deleted: false
    });
    const newCategory = createTreeHelper.tree(category);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products`);
  }

};


// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {

  const id = req.params.id;//Lấy giá trị của tham số id từ URL, thông qua req.params

  // chuyển đổi giá trị chuỗi sang số nguyên req.body là một đối tượng chứa dữ liệu được gửi từ phía client đến server thông qua yêu cầu HTTP POST hoặc PUT. 
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage);
  req.body.stock = parseInt(req.body.stock);
  req.body.position = parseInt(req.body.position);

  try {
    // thêm thời gian sửa sản phẩm và ai sửa
    const updatedBy = {
      account_id: res.locals.user.id,
      updatedAt: new Date()
    }

    // cập nhập dữ liệu vào mongodb theo ID và dữ liệu cập nhập là req.body
    await Product.updateOne({ _id: id }, {
      ...req.body,
      $push: { updatedBy: updatedBy }
    });

    // thông báo 
    req.flash("success", `Cập nhật thành công!`);

  } catch (error) {

    req.flash("error", `Cập nhật thất bại!`);

  }

  res.redirect("back");
};


// [GET] /admin/products/detail/:id 
//:id là một phần của định tuyến động
//Khi một yêu cầu được gửi tới đường dẫn này, giá trị của tham số id trong URL được trích xuất và lưu trong đối tượng params
module.exports.detail = async (req, res) => {

  try {
    const find = {
      deleted: false,
      _id: req.params.id// là giá trị của tham số id từ URL.
    };

    // tìm sản phẩm trong mongodb theo find 
    const product = await Product.findOne(find);

    res.render("admin/pages/products/detail", {
      // chuyền giá trị sang file detail.pug
      pageTitle: product.title,
      product: product,
    });
  } catch (error) {
    // nếu bị lỗi quay trở lại trang sản phẩm 
    res.redirect(`${systemConfig.prefixAdmin}/product`);
  }
};