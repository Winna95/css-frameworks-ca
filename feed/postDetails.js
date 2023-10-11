import {getPostById} from "../js/posts-api.js";


const postId = new URLSearchParams(document.location.search).get("postId");
console.log(postId);


function createHtmlForTag (tag) {
    return `<button class="fw-bolder border-0 bs-white-color">
                #${tag}
              </button>`;
}

getPostById(postId, true).then(post => {
    const postDetailsPlaceholder = document.querySelector("#detailsPost-placeholder");
    postDetailsPlaceholder.innerHTML = `
    <div
            class="bs-white-color rounded-2 col-lg-10 col-sm-12 mx-auto mt-5 mb-5"
          >
            <div class="d-flex pt-4">
              <img
                src="${post.author.avatar}"
                alt="profile picture"
                class="img-fluid rounded-circle col-2 ms-5 object-fit-cover feed-avatar-img"
              />
              <div class="ms-3 mt-4">
                <b>${post.author.name}</b>
                <p>${post.created}</p>
              </div>
            </div>
            <div class="text-center p-5">
              <img
                src="${post.media}"
                alt="post image"
                class="img-fluid rounded-2 post-img object-fit-cover"
              />
            </div>
            <h4 class="fw-bolder ps-5">${post.title}</h4>
            <p class="mx-auto px-5 pb-5">
              ${post.body}
            </p>
            <div class="mx-auto px-5 pb-5">
            ${post.tags.map(tag => createHtmlForTag(tag))}
            </div>
          </div>`;
})