const mongoose = require("mongoose");
const generate = require("../helpers/generate");

const accountSchema = new mongoose.Schema(
  {
    fullName: String, //tên
    email: String,  // email
    password: String,// mật khẩu
    token: {// string roundum lưu bên người dùng
      type: String,
      default: generate.generateRandomString(20) ,
    },
    phone: String,// số điện thoại
    avatar: String,// lưu kiểu đường link
    role_id: String,//quyền quản lý 
    status: String,//trang thái tài khoản 
    deleted: {// đã xoá chưa
      type: Boolean,
      default: false,
    },
    deletedAt: Date,// xoá thời gian nào 
  },
  {
    timestamps: true,// ngày tạo tài khoản ngày cập nhập là ngyaf nào 
  }
);
const Account = mongoose.model("Account", accountSchema, "accounts");
module.exports = Account;