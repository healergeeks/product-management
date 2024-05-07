module.exports = (objectPagination,query,countProducts) => {
    // kiểm tra xem tham số page có được chuyền theo yêu cầu trên HTTP không 
  if (query.page) {
    //nếu có thì cập nhập objectPagination.currentPage từ HTTP query.page và parseInt kiểu dữ liệu INT
    objectPagination.currentPage = parseInt(query.page);
  }
  //skip bỏ qua bao nhiêu phần tử == (trang hiện tại -1)*  số sản phẩm cần hiển thị mỗi trang 
  objectPagination.skip = (objectPagination.currentPage - 1) * objectPagination.limitItems;

  //tính tổng số trang dự trên tổng số sản phẩm  chia cho số sản phẩm cần hiển thị mỗi trang và ceil làm làm tròn lên 1 số 
  const totalPage = Math.ceil(countProducts / objectPagination.limitItems);

  // khởi tạo totalPage vào objectPagination
  objectPagination.totalPage = totalPage;

  return objectPagination;
}