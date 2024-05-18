// Permissions
const tablePermissions = document.querySelector("[table-permissions]");//Nó tìm kiếm một phần tử có thuộc tính table-permissions. lấy ra bảng dữ liệu (table) trong HTML
// nếu có mã khối tồn tại 
if (tablePermissions) {
  // lấy ra nút gửi (chập nhập)
  const buttonSubmit = document.querySelector("[button-submit]");
  // thiết lập sự kiện khi nhấn nút cập nhập 
  buttonSubmit.addEventListener("click", () => {
    // khởi tại mảng trống 
    let permissions = [];
    const rows = tablePermissions.querySelectorAll("[data-name]");// lấy ra các hàng trong bảng dữ liệu table có thuộc tính data-name
    //Lặp lại từng hàng trong bảng
    rows.forEach(row => {
      // Lấy giá trị của data-name thuộc tính trong bảng dữ liệu table
      const name = row.getAttribute("data-name");
      //Chọn tất cả các phần tử đầu vào trong bảng dữ liệu table
      const inputs = row.querySelectorAll("input");
      //Kiểm tra xem data-name thuộc tính của hàng(row) có "id" hay không.
      if (name == "id") {
        // Lặp lại từng đầu vào trong hàng ID
        inputs.forEach(input => {
          //Nhận giá trị của đầu vào, được coi là ID.
          const id = input.value;
          //Thêm một đối tượng mới vào mảng permissions có ID và một mảng quyền trống.
          permissions.push({
            id: id,
            permissions: []
          });
        })
        // Nếu data-name thuộc tính của hàng(row) không phải  "id" 
      } else {
        // lặp lại từng giá trị trong ô input 
        inputs.forEach((input, index) => {
          //Kiểm tra xem đầu vào có được checked có được chọn tích V trong input 
          const checked = input.checked;
          // nêsu có 
          if (checked) {
            // nó sẽ thêm tên quyền vào mảng quyền của ID tương ứng dựa trên chỉ mục.
            permissions[index].permissions.push(name);
          }
        });
      }
    });
    console.log(permissions);
    // kiểm tra trong mảng permissions phải có ít nhất 1 phẩn tử 
    if (permissions.length > 0) {
      const formChangePermissions = document.querySelector("#form-change-permissions");// lấy ra form có thuộc tính form-change-permissions
      const inputPermissions = formChangePermissions.querySelector("input[name = 'permissions']");// trong form lấy ra thẻ Input có Name
      inputPermissions.value = JSON.stringify(permissions);//Chuyển đổi permissionsmảng thành chuỗi JSON và đặt nó làm giá trị của trường đầu vào.
      formChangePermissions.submit();//Gửi biểu mẫu để gửi dữ liệu quyền đến máy chủ.
    }
  });
}
// End Permissions

// Permissions Data Default
const dataRecords = document.querySelector("[data-records]");//Dòng này chọn div phần tử chứa data-recordsthuộc tính chứa dữ liệu quyền ở định dạng JSON.
// nếu dataRecords tồn tại 
if (dataRecords) {
  const records = JSON.parse(dataRecords.getAttribute("data-records"));// chuyển đổi dữ liệu lấy từ dataRecords thành kiểu giá trị JSON

  const tablePermissions = document.querySelector("[table-permissions]");//Nó tìm kiếm một phần tử có thuộc tính table-permissions. lấy ra bảng dữ liệu (table) trong HTML
  // lặp qua từng giá trị  trong records
  records.forEach((record, index) => {
    const permissions = record.permissions;// lấy ra giá trị record có thuộc tính permissions
    // lặp qua từng phần tử trong giá trị đó 
    permissions.forEach(permission => {

      const row = tablePermissions.querySelector(`[data-name="${permission}"]`);//Nó chọn row trong bảng khớp với giá trị thuộc tính permission hiện tại bằng data-name thuộc tính.
      const input = row.querySelectorAll("input")[index];//Sau đó nó chọn phần tử đầu vào trong hàng đó tương ứng với chỉ mục của bản ghi hiện tại.
      input.checked = true;//Nó đặt checked thuộc tính của phần tử đầu vào thành true, cho biết rằng quyền này được bật cho bản ghi hiện tại.
    });
  })
}
// End Permissions Data Default