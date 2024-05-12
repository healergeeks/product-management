const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");

mongoose.plugin(slug);

const productCategorySchema = new mongoose.Schema({
  title: String,// tên sản phẩn 
  parent_idparent_id: {// danh mục cha 
    type: String,
    default: "",
  },
  description: String,// mô tả
  thumbnail: String,  // ảnh 
  status: String,//
  position: Number,
  slug: {
    type: String,
    slug: "title",
    unique: true
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  daletedAt: Date,
},
  {
    timestamps: true
  }
);


const ProductCategory = mongoose.model("Product-category", productCategorySchema, "product-category");
module.exports = ProductCategory;