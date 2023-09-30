import { isAuthenticated } from "../js/authenticate.js";
import {createPost, getPostsFromFollowed} from "../js/posts-api.js";

if(!isAuthenticated()) {
    window.location = "/"
}

const createPostForm = document.querySelector("#createPostForm")
createPostForm.addEventListener("submit", submitEvent => {
    //sjekk validering
    // hvis ok - kall på funksjon som sender kall til serveren
    // hvis det ikke går bra, vis form validations errors.
    // vise feilmelding fra serveren ved feil.
    // hvis det gikk bra å sende til serveren, null ut input feltene og vis melding til bruker om at posten er registert og med link til profil.
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
                //Todo change use of alert to something more pretty.
                alert("Your post could not be saved. Please check your inputs or try again later")
            }
        });
    } else {
        createPostForm.classList.add('was-validated');
    }
})

let allPostsFromServer;

function fetchPostFromServer(tag) {
    getPostsFromFollowed(tag).then(posts => {
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

//legg på key up eventlistener på seach input (for å oppdage hver gaang noen skriver noe)
//i eventlistenern sjekk om innholdet i inputen ikke er tomt eller blankt
//filtrere listen over lle poster, basert på det brukeren har skrevet inn.
// vis frem html for de gjenverende postene etter filtrering.


const searchInput = document.querySelector("#searchInput");
console.log(searchInput);

searchInput.onkeyup = function (event) {
    console.log(event);
    const searchQuery = searchInput.value
    console.log(searchQuery);
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


function insertPostsAsHtml(postsToShow) {
    const postsHtml =  postsToShow.map(post => {
        return `<div
            class="bs-white-color rounded-2 col-lg-10 col-sm-12 mx-auto mb-5"
          >
            <div class="d-flex pt-4">
              <img
                src="${post.author.avatar}"
                alt="profile picture"
                class="img-fluid rounded-circle col-2 ms-5 object-fit-fill"
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
          </div>`
    }).join(" ");
    const placeholderPosts = document.querySelector("#postsPlaceholder");
    placeholderPosts.innerHTML = postsHtml
}
function createHtmlForTag (tag) {
    return `<button class="fw-bolder border-0 bs-white-color">
                #${tag}
              </button>`;
}

const filterTagInput = document.querySelector("#filterTagInput");
filterTagInput.onkeyup = function (event) {
    const filterQuery = filterTagInput.value;
    if(filterQuery && filterQuery !== "" && filterQuery !== " ") {
        fetchPostFromServer(filterQuery);

    } else {
        fetchPostFromServer();
    }
}

//hente tags fra api
// legge til onkeyup eventlistener i søke feltet
//i eventlistenern sjekk om innholdet i inputen ikke er tomt eller blankt
//filtrere listen over alle poster, basert på det brukeren har skrevet inn via api'et.
//vis frem html for de postene som inneholder den tagget det er søkt etter.
//dersom det ikke er noen poster som inneholder den taggen det søkes etter, vis ingen poster.
//hvis bruker hvisker bort, må postene lastes inn på nytt.


