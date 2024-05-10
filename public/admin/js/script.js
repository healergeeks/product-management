// Button Status nút trạng thái 
const buttonsStatus = document.querySelectorAll("[button-status]");// lấy ra các phần tử mà có thuốc tính button-status
if (buttonsStatus.length > 0) {

  let url = new URL(window.location.href);// khởi tạo một đối tượng URL từ URL trình duyệt, đối tượng đó có thể để truy xuất các thành phần của URL như hostname, pathname, search parameters, và nhiều hơn nữa.

  buttonsStatus.forEach(button => {
    //addEventListener("click") cách lắng nghe sự kiện 
    button.addEventListener("click", () => {

      const status = button.getAttribute("button-status");// lấy ra thuộc tính gía trị button-status

      // kiểm tra xem status có tồn tại hay không 
      if (status) {

        url.searchParams.set("status", status);// tồn tại thì set thêm tham số "status" vào thuộc tính status
      } else {

        url.searchParams.delete("status");// không toàn tại thì delete xoá tham số "status" ở URL hiện tại 
      }

      window.location.href = url.href;// cập nhập URL mới bằng cách gán = url.href và window.location.href chuyển hướng trang 
    });
  });
}
// End Button Status

// Form Search biểu mẫu tìm kiếm 
const formSearch = document.querySelector("#form-search");//Dòng này tìm phần tử HTML có id là "form-search", và lưu trữ nó vào biến formSearch.
// formSearch có tồn tại hay không 
if (formSearch) {

  let url = new URL(window.location.href);//Dòng này tạo một đối tượng URL từ URL hiện tại của trình duyệt, sẽ được sử dụng để cập nhật query string của URL.

  formSearch.addEventListener("submit", (e) => {

    e.preventDefault();// Dòng này ngăn chặn hành vi mặc định của sự kiện submit, đảm bảo rằng trang không được tải lại khi biểu mẫu được gửi.

    const keyword = e.target.elements.keyword.value;// Dòng này trích xuất giá trị của trường tìm kiếm có tên là "keyword" từ biểu mẫu và lưu trữ vào biến keyword.

    if (keyword) {
      url.searchParams.set("keyword", keyword);//dòng này thêm một tham số "keyword" với giá trị là keyword vào query string của URL.
    } else {
      // url.searchParams.delete("keyword");/dòng này xóa tham số "keyword" khỏi query string của URL.
    }

    window.location.href = url.href;// cập nhập URL mới bằng cách gán = url.href và window.location.href chuyển hướng trang 
  });
}
// End Form Search

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");// lấy ra các phần tử HTML có thuộc tính button-pagination và querySelectorAll kiểm tra xe phần tử nào được chọn trên các phần tử HTML đó 


if (buttonsPagination) {

  let url = new URL(window.location.href);

  // Dòng này duyệt qua mỗi phần tử trong buttonsPagination, tức là mỗi nút phân trang.
  buttonsPagination.forEach(button => {

    //Dòng này thêm một sự kiện "click" cho mỗi nút phân trang. Khi người dùng nhấp vào nút này, một hàm được gọi.
    button.addEventListener("click", () => {

      const page = button.getAttribute("button-pagination");// Dòng này lấy giá trị của thuộc tính button-pagination  từ nút được nhấp vào. 

      url.searchParams.set("page", page);//: Dòng này cập nhật tham số truy vấn "page" của URL với giá trị mới, tương ứng với trang mà người dùng đã chọn.

      window.location.href = url.href;//Dòng này cập nhật URL trên thanh địa chỉ của trình duyệt với URL mới mà bạn đã cập nhật các tham số truy vấn của nó.
    });
  });
}
// End Pagination



// Checkbox Multi tính năng chọn 1 hoặc nhiều thì chọn tất cả 
const checkboxMulti = document.querySelector("[checkbox-multi]");

if (checkboxMulti) {

  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");

  const inputsId = checkboxMulti.querySelectorAll("input[name='id']");

  inputCheckAll.addEventListener("click", () => {

    if (inputCheckAll.checked) {

      inputsId.forEach(input => {

        input.checked = true;
      });
    } else {

      inputsId.forEach(input => {

        input.checked = false;
      });
    }
  });
  inputsId.forEach((input) => {

    input.addEventListener("click", () => {

      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

      if (countChecked == inputsId.length) {

        inputCheckAll.checked = true;
      } else {

        inputCheckAll.checked = false;
      }
    });
  });
}
// End Checkbox Multi


// Form Change Multi thay đổi nhiều trang thái hoạt động 
const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {

  formChangeMulti.addEventListener("submit", (e) => {

    e.preventDefault();

    const checkboxMulti = document.querySelector("[checkbox-multi]");

    const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked"); //checked những sản phẩm đã tích V

    const typeChange = e.target.elements.type.value;
    //e.target` là phần tử HTML mà sự kiện được kích hoạt trên.
    //e.target.elements` là một thuộc tính của phần tử gửi ra sự kiện
    //type.value lấy ra giá trị nằm trong biểu mẫu. 

    if (typeChange == "delete-all") {

      const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");

      if (!isConfirm) {
        return;
      }
    }

    if (inputsChecked.length > 0) {

      let ids = [];

      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputsChecked.forEach(input => {

        const id = input.value;

        if (typeChange == "change-position") {

          const position = input.closest("tr").querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`);

        } else {

          ids.push(id);

        }
      });

      inputIds.value = ids.join(", ");

      formChangeMulti.submit();

    } else {

      alert("Vui lòng chọn ít nhất một bản ghi!");

    }
  });
}
//end Form Change Multi


// Show Alert(hiển thị cảnh báo thời gian hiển thị  )
const showAlert = document.querySelector("[show-alert]");

if (showAlert) {

  const time = parseInt(showAlert.getAttribute("data-time"));

  const closeAlert = showAlert.querySelector("[close-alert]");

  setTimeout(() => { showAlert.classList.add("alert-hidden");}, time);

  closeAlert.addEventListener("click", () => { showAlert.classList.add("alert-hidden");});
}
// End Show Alert


// Upload Image(tải hình ảnh lên)
const uploadImage = document.querySelector("[upload-image]");//chọn phần tử HTML có thuộc tính [upload-image]

//uploadImage có tồn tại hay không
if (uploadImage) {
  //phần tử HTML có thuộc tính 
  const uploadImageInput = document.querySelector("[upload-image-input]");
  const uploadImagePreview = document.querySelector("[upload-image-preview]");

  //Đăng ký một sự kiện "change" cho uploadImageInput. Khi người dùng chọn một hình ảnh từ hộp thoại tải lên, sự kiện này sẽ được kích hoạt.
  uploadImageInput.addEventListener("change", (e) => {

    //Khi sự kiện "change" xảy ra, đoạn mã sẽ lấy ra tệp tin được chọn bằng cách truy cập vào target.files[0] của sự kiện change.
    const file = e.target.files[0];
    //file tồn tại
    if (file) {

      uploadImagePreview.src = URL.createObjectURL(file);//nó sẽ tạo một URL địa chỉ tạm thời (URL.createObjectURL(file)) cho hình ảnh được chọn và gán nó vào thuộc tính src của phần tử uploadImagePreview, điều này sẽ dẫn đến việc hiển thị hình ảnh được chọn trên trang web.
    }
    /**URL.createObjectURL() là một phương thức của đối tượng URL trong JavaScript. Nó được sử dụng để tạo một URL đặc biệt, gọi là "object URL", từ một đối tượng có thể định danh được như một File, Blob, hoặc MediaSource. */
  });
}
// End Upload Image


// Sort (sắp xếp sản phẩm )
const sort = document.querySelector("[sort]");//lấy phần tử HTML có thuộc tính [sort]

//có phần tử sort được lấy hay không
if (sort) {

  let url = new URL(window.location.href);//Tạo một đối tượng URL từ địa chỉ URL hiện tại của trang web.

  const sortSelect = sort.querySelector("[sort-select]");// Tìm phần tử con trong sort có thuộc tính [sort-select]. Đây có thể là một thẻ <select>
  const sortClear = sort.querySelector("[sort-clear]");//Tìm phần tử con trong sort có thuộc tính [sort-clear].là một nút dùng để xóa các tham số sắp xếp khỏi URL.

  // săp xếp
  //(e) => { ... }: Đây là một hàm số (arrow function) được thực thi khi sự kiện "change" xảy ra. Biến e là đối tượng sự kiện (event object) chứa thông tin về sự kiện.
  sortSelect.addEventListener("change", (e) => {

    const value = e.target.value;//Lấy giá trị của phần tử mà sự kiện được kích hoạt trên, trong trường hợp này là giá trị được chọn trong sortSelect

    const [sortKey, sortValue] = value.split("-");//split Phân tách giá trị được chọn thành hai phần sortKey và sortValue bằng cách tách chuỗi thành mảng sử dụng dấu gạch ngang "-" làm điểm phân cách.

    //Đặt các tham số sortKey và sortValue trong đối tượng URLSearchParams của URL. Điều này sẽ cập nhật URL với các tham số mới.
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;//Thay đổi URL của trình duyệt để chuyển hướng đến URL mới đã được cập nhật.
  });

  // Xóa sắp xếp
  //thiết lập một sự kiện lắng nghe cho sự kiện "click" trên phần tử sortClear.
  sortClear.addEventListener("click", () => {

    //Xóa các tham số sortKey và sortValue khỏi đối tượng URLSearchParams của URL. Điều này loại bỏ các tham số sắp xếp khỏi URL.
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url.href;////Thay đổi URL của trình duyệt để chuyển hướng đến URL mới đã được cập nhật.
  });

  // Thêm selected cho option
  // Lấy giá trị của tham số sortKey và sortValue từ URLSearchParams của URL.
  const sortkey = url.searchParams.get("sortKey");
  const sortValue = url.searchParams.get("sortValue");

  //cả hai giá trị sortKey và sortValue có tồn tại không
  if (sortkey && sortValue) {

    //Tạo một chuỗi stringSort bằng cách kết hợp sortKey và sortValue với dấu gạch ngang "-" ở giữa.
    const stringSort = `${sortkey}-${sortValue}`;

    // Tìm phần tử <option> trong phần tử sortSelect mà có giá trị thuộc tính value trùng khớp với chuỗi stringSort.
    const optionSelected = sortSelect.querySelector(`option[value='${ stringSort }']`);

    //Đặt thuộc tính selected của phần tử <option> đã được tìm thấy ở bước trước thành true
    optionSelected.selected = true;// hiện thị trong ô select
  }
}
// End Sort