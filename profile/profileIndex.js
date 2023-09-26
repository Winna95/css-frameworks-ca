import { isAuthenticated } from "../js/authenticate.js";
import {deletePost, getPostsByUser} from "../js/posts-api.js";

if(!isAuthenticated()) {
    window.location = "/"
}

const nameOfLoggedInUser = localStorage.getItem("name");

function loadAndRenderPosts() {
    getPostsByUser(nameOfLoggedInUser).then(postsByUser => {
        const placeholderProfilePosts = document.querySelector("#placeholderProfilePosts");
        const listOfHtmlPosts = postsByUser.map(postByUser => {
            return `<div
            class="col-12 col-sm-6 mx-auto d-flex justify-content-center mb-5 grid gap-3"
          >
            <div class="bs-white-color px-4 rounded-2">
            <div class="d-flex justify-content-end">
            <button id="deleteBtn" class="mt-2" data-postId="${postByUser.id}">Delete</button>
            </div>
            
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

        const deleteBtns = document.querySelectorAll("#deleteBtn");
        console.log(deleteBtns);
        deleteBtns.forEach(btn => {
            btn.addEventListener("click", event => {
                const postId = btn.getAttribute("data-postId");
                deletePost(postId).then(successfulDeletedPost => {
                    if(successfulDeletedPost) {
                        loadAndRenderPosts();
                    } else {
                        alert("Could not delete post, please try again later")
                    }
                });
            })
        })
    }).catch(error => {
        //Todo - lage denne med placeholder
        alert(error);
    });
}

loadAndRenderPosts();

// legge til en delete knapp
// når man trykker på knappen skal man kunne slette posten
// legge til en eventlistener på knappen
// slette posten på serveren via api
//hvis det går bra å slette den, vise siden på nytt med postene

