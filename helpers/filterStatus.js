module.exports = (query) => {
  // bộ lọc trạng thái của sản phẩm có hoặt động hay không 
  let filterStatus = [
    {
      name: "Tất cả",
      status: "",
      class: "",
    },
    {
      name: "Hoạt động",
      status: "active",
      class: "",
    },
    {
      name: "Dừng hoạt động",
      status: "inactive",
      class: "",
    }
  ]

  //giá trị thuộc tính status có tồn tại hay không trên URL
  if (query.status) {
    // lấy ra vị trí trong filterStatus ở vị trí đầu tiên có req.query.status người dùng chuyền lên URL bằng với status trong filterStatus lấy ra vị trí 
    const index = filterStatus.findIndex(item => item.status == query.status);
    filterStatus[index].class = "active";//ở vị trí object hiện tại thì gán giá trị active cho thuộc tính class để thay đổi màu nút
  } else {
    const index = filterStatus.findIndex(item => item.status == "");//nếu không tìm thấy mà status thì lấy ra vị trí trong filterStatus mà rỗng
    filterStatus[index].class = "active";// ở vị trí object hiện tại thì gán giá trị active cho thuộc tính class để thay đổi màu nút
  }
  return filterStatus;
}