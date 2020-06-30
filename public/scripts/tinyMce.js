window.onload = function () {
  tinymce.init({
    selector: '#tiny-mce-post-body',
    plugins: 'preview image  autolink lists  media  table',
    toolbar: 'bold italic underline  preview image  code pageembed  table',
    toolbar_mode: 'floating',
    height: 300,
    automatic_uploads: true,
    images_upload_url: '/uploads/postImage',
    relative_urls: false,
    images_upload_handler: function (blobInfo, success, failer) {
      let headers = new Headers();
      headers.append('Accept', 'Application/JSON');
      let formData = new FormData();
      formData.append('post-image', blobInfo.blob(), blobInfo.filename());

      let req = new Request('/uploads/postImage', {
        method: 'POST',
        headers,
        mode: 'cors',
        body: formData,
      });
      fetch(req)
        .then((res) => res.json())
        .then((data) => success(data.imgUrl))
        .catch(() => failer('http error'));
    },
  });
};
