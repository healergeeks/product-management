tinymce.init({
  selector: 'textarea.textarea-mce',
  // plugins: 'lists link image table code help wordcount'
  toolbar: 'undo redo | styles | bold italic | alignleft aligncenter alignright alignjustify | outdent indent',
  plugins: 'image',
  file_picker_callback: (cb, value, meta) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');

    input.addEventListener('change', (e) => {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.addEventListener('load', () => {
        /*
           Lưu ý: Bây giờ chúng ta cần đăng ký blob trong blob hình ảnh TinyMCEs
           sổ đăng ký. Trong bản phát hành tiếp theo, phần này hy vọng sẽ không có
           cần thiết vì chúng tôi đang tìm cách xử lý vấn đề này trong nội bộ.
         */
        const id = 'blobid' + (new Date()).getTime();
        const blobCache =  tinymce.activeEditor.editorUpload.blobCache;
        const base64 = reader.result.split(',')[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);

        /* gọi hàm gọi lại và điền tên tệp vào trường Tiêu đề */
        cb(blobInfo.blobUri(), { title: file.name });
      });
      reader.readAsDataURL(file);
    });

    input.click();
  },
});