const ProductCategory = require("../../models/product-category.model");

const filterStatusHelpers = require("../../helpers/filterStatus");

const searchHelpers = require("../../helpers/search");

const systemConfig = require("../../config/system");

const paginationHealper = require("../../helpers/pagination");

const createTreeHelper = require("../../helpers/createTree");
// [GET] /admin/products-category 
module.exports.index = async (req, res) => {

  const filterStatus = filterStatusHelpers(req.query);
  // bộ lọc tìm kiếm 
  const objectSearch = searchHelpers(req.query);

  let find = {
    deleted: false,
  };

  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  if (req.query.status) {
    find.status = req.query.status;
  }

  // let sort = {};

  // if (req.query.sortKey && req.query.sortValue) {

  //   sort[req.query.sortKey] = req.query.sortValue;
  // } else {
  //   sort.position = "desc";
  // }

  const countProductCategory = await ProductCategory.countDocuments(find);
  let objectPagination = paginationHealper(
    {
      currentPage: 1,
      limitItems: 4,
    },
    req.query,
    countProductCategory,
  );

  const records = await ProductCategory.find(find)//.sort(sort)
  //.populate('parent_id');
  //populate('parent_id'); tham chiếu hay là lấy ra các tâif liệu liên quan đến parent_id để hiển thị ra ngoài màn hình
  const Newrecords = createTreeHelper.tree(records);
  res.render("admin/pages/products-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: Newrecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination,
  });
};

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {

  const type = req.body.type;//type loạt hành động được gửi đi. mã lấy ra các tham số từ yêu cầu HTTP được gửi bởi client. 

  const ids = req.body.ids.split(", ");//split()phân tách bằng dấu phẩy và khoảng trắng ", ".

  switch (type) {
    case "active":// nếu type là "active", các sản phẩm tương ứng với các ID được cung cấp sẽ được cập nhật trạng thái thành "active" trong cơ sở dữ liệu.

      await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });

      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);

      break;
    case "inactive":

      await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" });

      req.flash("success", `Cập nhật trạng thái thành công ${ids.length} sản phẩm`);

      break;
    case "delete-all"://nếu type là "delete-all" các sản phẩm sẽ được xoá và được lưu thời gian xoá 
      await ProductCategory.updateMany(
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
        await ProductCategory.updateOne({ _id: id }, { position: position });
      }
      break;
    default:
      break;
  }
  res.redirect("back");
};


//[PATCH] /admin/products/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {

  const status = req.params.status;
  const id = req.params.id;

  req.flash("success", "Cập nhật trạng thái thành công!");

  await ProductCategory.updateOne({ _id: id }, { status: status });

  res.redirect("back");
}

// [GET] /admin/products-category/create 
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  };
  const records = await ProductCategory.find(find);
  
  const Newrecords = createTreeHelper.tree(records);

  res.render("admin/pages/products-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: Newrecords,
  });
};

const mongoose = require('mongoose');

// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {
  if (req.body.position == "") {
    const count = await ProductCategory.countDocuments();
    req.body.position = count + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  // Xử lý giá trị parent_id
  if (!req.body.parent_id) {
    req.body.parent_id = null; // Nếu không có giá trị, đặt là null
  } else {
    req.body.parent_id = new mongoose.Types.ObjectId(req.body.parent_id); // Chuyển đổi parent_id sang ObjectId
  }

  const record = new ProductCategory(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/products-category`);
};

// [GET] /admin/products-category/edit/:id 
module.exports.edit = async (req, res) => {
  
  try {
    const id = req.params.id;
    const data = await ProductCategory.findOne({
      _id: id,
      deleted: false
    });
    const records = await ProductCategory.find({
      deleted: false
    });
    const newRecords = createTreeHelper.tree(records);
    res.render("admin/pages/products-category/edit", {
      pageTitle: "Chỉnh sửa danh mục sản phẩm",
      data: data,
      records: newRecords,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/products-category`);
  }
};


// [PATCH] /admin/products-category/edit/:id
module.exports.editPatch = async (req, res) => {

  const id = req.params.id;

  req.body.price = parseInt(req.body.price);

  req.body.position = parseInt(req.body.position);

  try {
    await ProductCategory.updateOne({ _id: id }, req.body);

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
      _id: req.params.id
    };
    const productCategory = await ProductCategory.findOne(find);
    console.log("ok")
    res.render("admin/pages/products-category/detail", {

      pageTitle: ProductCategory.title,
      ProductCategory: productCategory,
    });
  } catch (error) {

    res.redirect(`${systemConfig.prefixAdmin} / products - category`);
  }
};

// [DELETE] /admin/products/delete/:id
module.exports.deleteItem = async (req, res) => {

  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, {
    deleted: true,
    daletedAt: new Date(),
  });
  req.flash("success", `Dã xoá thành công sản phẩm`);

  res.redirect("back");
};