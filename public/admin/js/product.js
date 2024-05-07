// Change Status
const buttonsChangeStatus = document.querySelectorAll("[button-change-status]") // lấy tất các phần tử có trong tài liệu thuộc tính [button-change-status]

// kiểm tra xem có bất kỳ phàn tử nào có trong mảng không   
if (buttonsChangeStatus.length > 0) {

  const formChangeStatus = document.querySelector("#form-change-status");// để truy xuất đối tượng form có id là form-change-status.

  const path = formChangeStatus.getAttribute("data-path");// lấy ra giá trị của thuộc tính data-path chứa đường dẫn mà yêu cầu PATCH sẽ được gửi đến.

  // lặp qua từng phần tử lắng nghe sự kiện "click". 
  buttonsChangeStatus.forEach(button => {
    button.addEventListener("click", () => {

      const statusCurrent = button.getAttribute("data-status");//lấy giá trị của nút, đại diện cho trạng thái hiện tại của đối tượng.

      const id = button.getAttribute("data-id");// lấy giá trị của nút, đại diện cho id của đối tượng.

      let statusChange = statusCurrent == "active" ? "inactive" : "active";// thay đổi trạng thái của núi 

      const action = path + `/${statusChange}/${id}?_method=PATCH`;//Tạo ra đường dẫn hành động (action) bằng cách kết hợp path, statusChange, id, và thêm một tham số _method=PATCH để xác định phương thức HTTP là PATCH.

      formChangeStatus.action = action;// cập nhập giá trị action trong formChangeStatus

      formChangeStatus.submit();// gửi yêu cầu lên HTTP để sử lý dữ liệu 
    });
  });
}
// End Change Status

// Delete Item
const buttonsDelete = document.querySelectorAll("[button-delete]");

if (buttonsDelete.length > 0) {

  const formDeleteItem = document.querySelector("#form-delete-item");

  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach(button => {

    button.addEventListener("click", () => {

      const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này?");

      if (isConfirm) {

        const id = button.getAttribute("data-id");

        const action = `${path}/${id}?_method=DELETE`;
        console.log(action);

        formDeleteItem.action = action;

        formDeleteItem.submit();
      }
    });
  });
}
// end Delete Item
