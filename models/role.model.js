const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  title: String,// tên sản phẩn 
  permissions: {
    type: Array,
    default: [],
  },
  description: String,
  deleted: {
    type: Boolean,
    default: false,
  },
  daletedAt: Date,
}, {
  timestamps: true
}
);
const Role = mongoose.model("Role", roleSchema, "roles");
module.exports = Role;