$(document).ready(function () {
  let mainMenu = $(".main_menu");
  let title = $("#post_title");
  let date = $(".post-date");
  let decriptsion = $("#post_decriptsion");
  let postContent = $("#post_content");
  let postImg = $("#post_img");

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const id = urlParams.get("id");

  let btnLike =$('#btn-like');

  let arrListLike = JSON.parse(localStorage.getItem("listLike")) || [];
  $(document).on("click", ".btn-like", function (e) {
    e.preventDefault();
    let imgsrc = $(this).attr("src");
    let id = $(this).data('id');

    console.log(imgsrc,id);
    if (imgsrc == "./assets/img/heart_empty.png") {
      $(this).attr("src", "./assets/img/heart_full.png");
      arrListLike.push(id);     
    } else {
      $(this).attr("src", "./assets/img/heart_empty.png");
      arrListLike = arrListLike.filter(item => item != id);
    }
    localStorage.setItem('listLike',JSON.stringify(arrListLike));
  });


  renderMenu();

  let allComments = JSON.parse(localStorage.getItem("comment")) || [];
  let comments = allComments.filter(function (element) {
    return element.artiles_id === id;
  });
  console.log(comments);
  let inputName = $("#c-name");
  let inputComment = $("#comment");
  let areaComment = $("#singlecomments");
  let commentsCount = $("#comments-count");
  let numberComment = comments.length;
  let postTotalComment = $('#post_total_comment');
  postTotalComment.text(numberComment);
  commentsCount.html(numberComment);

  // render list comment
  let commentsContent = "";
  for (let i = 0; i < comments.length; i++) {
    commentsContent += renderCommentsItem(comments[i]);
  }
  areaComment.html(commentsContent);

  $("#btn-submit").click(function (e) {
    e.preventDefault();
    let newComment = {
      name: inputName.val(),
      comment: inputComment.val(),
      date: new Date(),
      artiles_id: id,
    };

    allComments.push(newComment);
    localStorage.setItem("comment", JSON.stringify(allComments));

    areaComment.prepend(renderCommentsItem(newComment));

    numberComment++;
    commentsCount.html(numberComment);
    postTotalComment.text(numberComment);

    inputName.val("");
    inputComment.val("");
  });

function renderCommentsItem(item) {
    return `
          <li class="comment">
              <div class="comment-header d-md-flex align-items-center">
                  <div class="d-flex align-items-center">
                      <figure class="user-avatar"><img class="rounded-circle" alt=""
                              src="./assets/img/avatars/u1.jpg" /></figure>
                      <div>
                          <h6 class="comment-author"><a href="#"
                                  class="link-dark">${item.name}</a></h6>
                          <ul class="post-meta">
                              <li><i class="uil uil-calendar-alt"></i>${item.date}</li>
                          </ul>
                          <!-- /.post-meta -->
                      </div>
                      <!-- /div -->
                  </div>
                  <!-- /div -->
                  <div class="mt-3 mt-md-0 ms-auto">
                      <a href="#"
                          class="btn btn-soft-ash btn-sm rounded-pill btn-icon btn-icon-start mb-0"><i
                              class="uil uil-comments"></i> Reply</a>
                  </div>
                  <!-- /div -->
              </div>
              <!-- /.comment-header -->
              <p>${item.comment}</p>
          </li> 
          `;
  }
// =================RENDER MENU================
function renderMenu() {
  $.ajax({
    type: "GET",
    url: "http://apiforlearning.zendvn.com/api/categories_news",
    data: {
      offset: 0,
      limit: 20,
    },
    dataType: "json",
    success: function (data) {
      let content = "";
      let contentMenuOther = "";
      for (let i = 0; i < data.length; i++) {
        let name = data[i].name;
        let link = data[i].link;
        let linkCategory = "category.html?id=" + data[i].id;
        // if (i == data[i].id) {
        //   titleLarge.html(`<h1 class="display-1 mb-3">${name}</h1>`);
        // }
        if (i < 5) {
          content += `
                <li class="nav-item">
                    <a class="nav-link" href="${linkCategory}">${name}</a>
                </li>
                    `;
        } else {
          contentMenuOther += `
                <li class="nav-item"><a class="dropdown-item" href="${linkCategory}">${name}</a></li>
                `;
        }
      }

      let result =
        content +
        `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Danh mục
                    khác</a>
                <ul class="dropdown-menu">
                    ${contentMenuOther}
                </ul>
            </li>
            <li class="nav-item">
                <a class="nav-link" href="favorites_list.html"><img src="./assets/img/playlist.png" alt="Danh sach yeu thich"title="Danh Sách Yêu Thích"></a>
            </li>
            `;

      mainMenu.html(result);
    },
  });
}
  $.ajax({
    type: "GET",
    url: "http://apiforlearning.zendvn.com/api/articles/" + id,
    data: "data",
    dataType: "json",
    success: function (data) {
      title.html(data.title);
      date.html(data.publish_date);
      decriptsion.html(data.description);
      postContent.html(data.content);
      postImg.css("background-image", `url(${data.thumb})`);
    },
  });
});
