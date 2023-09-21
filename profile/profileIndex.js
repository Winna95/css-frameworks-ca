import { isAuthenticated } from "../js/authenticate.js";
import {getPostsByUser} from "../js/posts-api";

if(!isAuthenticated()) {
    window.location = "/"
}

const nameOfLoggedInUser = localStorage.getItem("name");
getPostsByUser(nameOfLoggedInUser).then(postByUser => {
const placeholderProfilePosts = document.querySelector("#placeholderProfilePosts")
})