import {isAuthenticated} from "../js/authenticate.js";
import {createPost, getPostsFromFollowed} from "../js/posts-api.js";
import {getProfileForName} from "../js/profile-api.js";

if(!isAuthenticated()) {
    window.location = "/"
}

const createPostForm = document.querySelector("#createPostForm")


/**
 * Event handler for submitting when creating a post.
 *
 * This function is triggered when the createPostForm is submitted.
 * It prevents the default form submission behavior, validates the form,
 * and submits the post data to the server using the `createPost` function.
 * It also shows a message for success or failure of the post submission.
 *
 * @param {Event} submitEvent - The submit event triggered by the createPostForm.
 * @returns {void}
 */
createPostForm.addEventListener("submit", submitEvent => {
    submitEvent.stopPropagation();
    submitEvent.preventDefault();
    if(createPostForm.checkValidity()) {
        const headerInput = document.querySelector("#headerInput").value;
        const textInput = document.querySelector("#textInput").value;
        const imageInput = document.querySelector("#imageInput").value;
        const tagsInput = document.querySelector("#tagInput").value;
        let tags;
        if(tagsInput) {
            tags = [tagsInput]
        }
        createPost(headerInput, textInput, tags, imageInput).then(successfulPost=> {
            if(successfulPost) {
                document.querySelector("#headerInput").value = "";
                document.querySelector("#textInput").value = "";
                document.querySelector("#imageInput").value = "";
                document.querySelector("#tagInput").value = "";
                const profileLink = document.querySelector("#profileLink");
                profileLink.classList.remove("d-none");
                setTimeout(()=>{
                    profileLink.classList.add("d-none");
                }, 3000);
            } else {
                const placeholderUnsuccessfulPostSubmit = document.querySelector("#placeholderUnsuccessfulPostSubmit");
                placeholderUnsuccessfulPostSubmit.classList.remove("d-none");
                setTimeout(() => {
                    placeholderUnsuccessfulPostSubmit.classList.add("d-none")
                },3000)
            }
        });
    } else {
        createPostForm.classList.add('was-validated');
    }
})

let allPostsFromServer;


/**
 * Fetches posts from the server based on a specified tag and updates the HTML content.
 *
 * @param {string} tag - The tag to filter posts by.
 * @param sort
 * @returns {void}
 * @example
 */
function fetchPostFromServer(tag, sort) {
    getPostsFromFollowed(tag, sort).then(posts => {
        const noPostPlaceholder = document.querySelector("#noPostsPlaceholder");
        if (posts.length === 0) {
            noPostPlaceholder.classList.remove("d-none");
            insertPostsAsHtml([])
        } else {
            allPostsFromServer = posts;
            insertPostsAsHtml(allPostsFromServer);
            noPostPlaceholder.classList.add("d-none");
        }
    })
}

fetchPostFromServer();

let sortValue = null;
const sortSelect = document.querySelector("#sortSelect");
/**
 * Event handler for the change event on a select element to sort and update posts.
 *
 * @param {Event} event - The change event object triggered when the select element's value changes.
 */
sortSelect.onchange = event => {
    sortValue = sortSelect.value;
    if(sortValue === "null") {
        sortValue = null;
    }
    fetchPostFromServer(filterQuery, sortValue)
};



const searchInput = document.querySelector("#searchInput");

/**
 * Event handler for searching posts based on a search input.
 *
 * This function is triggered when a user types into the searchInput field.
 * It filters the posts based on the provided search query and updates
 * the displayed posts accordingly.
 *
 * @param {Event} event - The keyup event triggered by the searchInput field.
 * @returns {void}
 */
searchInput.onkeyup = function (event) {
    const searchQuery = searchInput.value
    if(searchQuery && searchQuery !== "" && searchQuery !== " " ) {
       const filteredPosts = allPostsFromServer.filter(postFromServer => {
            const jsonForPosts = JSON.stringify(postFromServer).toLowerCase();
            const index = jsonForPosts.indexOf(searchQuery.toLowerCase());
            if(index === -1) {
                return false
            }
            return true;
        });
       insertPostsAsHtml(filteredPosts);
    } else {
        insertPostsAsHtml(allPostsFromServer);
    }
}

/**
 * Creates an HTML image element or an image placeholder icon based on the provided media URL.
 *
 * @param {string|null} media - The URL of the post media or null if no media is available.
 * @returns {string} The HTML code for the image element or the image placeholder icon.
 */
function createImgForPostMedia(media) {
    if(media) {
        return `<img
                src="${media}"
                alt="post image"
                class="img-fluid rounded-2 post-img object-fit-cover"
              />`
    } else {
        return `<i class="fa-regular fa-image"></i>`;
    }
}

/**
 * Creates an HTML image element for an author's avatar or an image placeholder icon based on the provided avatar URL.
 *
 * @param {string|null} avatar - The URL of the author's avatar or null if no avatar is available.
 * @returns {string} The HTML code for the image element or the image placeholder icon.
 */
function createImageForAuthorAvatar(avatar) {
    if(avatar) {
        return `<img
                src="${avatar}"
                alt="profile picture"
                class="img-fluid rounded-circle col-2 ms-5 object-fit-cover feed-avatar-img"
              />`
    } else {
        return `<i class="fa-regular fa-image"></i>`;
    }

}

/**
 * Inserts an array of posts as HTML elements into the specified placeholder.
 *
 * @param {Array} postsToShow - An array of post objects to be displayed as HTML elements.
 * @returns {void}
 * @example
 */
function insertPostsAsHtml(postsToShow) {
    const postsHtml =  postsToShow.map(post => {
        return `<a href="postDetails.html?postId=${post.id}"> <div
            class="bs-white-color rounded-2 col-lg-10 col-sm-12 mx-auto mb-5"
          >
            <div class="d-flex pt-4">
            ${createImageForAuthorAvatar(post.author.avatar)}
              
              <div class="ms-3 mt-4">
                <b>${post.author.name}</b>
                <p>${post.created}</p>
              </div>
            </div>
            <div class="text-center p-5">
            ${createImgForPostMedia(post.media)}
              
            </div>
            <h4 class="fw-bolder ps-5">${post.title}</h4>
            <p class="mx-auto px-5 pb-5">
              ${post.body}
            </p>
            <div class="mx-auto px-5 pb-5">
            ${post.tags.map(tag => createHtmlForTag(tag))}
            </div>
          </div>
          </a>
`
    }).join(" ");
    const placeholderPosts = document.querySelector("#postsPlaceholder");
    placeholderPosts.innerHTML = postsHtml
}

/**
 * Creates an HTML button element representing a tag.
 *
 * @param {string} tag - The tag text.
 * @returns {string} - An HTML button element as a string.
 * @example
 */
function createHtmlForTag (tag) {
    return `<button class="fw-bolder border-0 bs-white-color">
                #${tag}
              </button>`;
}

const filterTagInput = document.querySelector("#filterTagInput");
/**
 * Event handler for filtering posts based on a tag input.
 *
 * This function is triggered when a user types into the filterTagInput field.
 * It fetches posts from the server based on the provided tag query and updates
 * the displayed posts accordingly.
 *
 * @param {Event} event - The keyup event triggered by the filterTagInput field.
 * @returns {void}
 * @example
 */
filterTagInput.onkeyup = function (event) {
    filterQuery = filterTagInput.value;
    if(filterQuery && filterQuery !== "" && filterQuery !== " " && filterQuery !== null) {
        fetchPostFromServer(filterQuery, sortValue);
    } else {
        fetchPostFromServer(null, sortValue);
    }
}
let filterQuery = null;
/**
 * Renders a list of friends' avatars on the social media app.
 *
 * @param {Array} myFriends - An array of friend objects with avatar information.
 * @returns {void}
 */
function renderFriends(myFriends) {
    const seeFriendsPlaceholder = document.querySelector("#seeFriendsPlaceholder");
    const listOfFriendsInHtml = myFriends.map(friend => {
        return `
          <img
            src="${friend.avatar}"
            alt="profile picture"
            class="img-fluid rounded-circle col-2 p-3 feed-avatar-img object-fit-cover"
          />
        `
    })
    seeFriendsPlaceholder.innerHTML = listOfFriendsInHtml.join(" ");
}

/**
 * Loads and displays the friends of the currently logged-in user on the app.
 *
 * This function retrieves the profile of the current user, extracts their friends' information,
 * and renders the first 5 friends' avatars on the app. It also handles the "See More" and "See Fewer"
 * buttons to show or hide all the friends.
 *
 * @returns {void}
 */
function loadFriendsOfUser() {

    const nameOfCurrentUser = localStorage.getItem("name");
    getProfileForName(nameOfCurrentUser, true).then(profile => {
        const myFriends = profile.following.slice(0,5);
        renderFriends(myFriends);

        const seeFriendsBtn = document.querySelector("#seeFriendsBtn");
        const seeFewerFriendsBtn = document.querySelector("#seeFewerFriends");
        if(profile.following.length < 5) {
            seeFriendsBtn.classList.add("d-none");
        } else {
            seeFriendsBtn.addEventListener("click", event => {
                renderFriends(profile.following);
                seeFewerFriendsBtn.classList.remove("d-none");
                seeFriendsBtn.classList.add("d-none");
            })
        }

        seeFewerFriendsBtn.addEventListener("click", event => {
            renderFriends(myFriends);
            seeFewerFriendsBtn.classList.add("d-none");
            seeFriendsBtn.classList.remove("d-none");
        })


    })
}

loadFriendsOfUser()

