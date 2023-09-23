import { isAuthenticated } from "../js/authenticate.js";
import {getPostsByUser} from "../js/posts-api.js";

if(!isAuthenticated()) {
    window.location = "/"
}

const nameOfLoggedInUser = localStorage.getItem("name");
getPostsByUser(nameOfLoggedInUser).then(postsByUser => {
const placeholderProfilePosts = document.querySelector("#placeholderProfilePosts");
const listOfHtmlPosts = postsByUser.map(postByUser => {
    return `<div
            class="col-12 col-sm-6 mx-auto d-flex justify-content-center mb-5 grid gap-3"
          >
            <div class="bs-white-color px-4 rounded-2">
              <img
                src="${postByUser.media}"
                alt=""
                class="img-fluid my-3 mx-auto rounded-2"
              />
              <h5 class="fw-bold">${postByUser.title}</h5>
              <p>
                ${postByUser.body}
              </p>
            </div>
          </div>`;
});
placeholderProfilePosts.innerHTML = listOfHtmlPosts.join(" ");
}).catch(error => {
    //Todo - lage denne med placeholder
    alert(error);
});