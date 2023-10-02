import { isAuthenticated } from "../js/authenticate.js";
import {deletePost, getPostById, getPostsByUser, updatePost} from "../js/posts-api.js";
import {getProfileForName} from "../js/profile-api.js";

if(!isAuthenticated()) {
    window.location = "/"
}

const nameOfLoggedInUser = localStorage.getItem("name");

function composeUpdateFormHtml(post, tagsString) {
    return `<form novalidate class="row p-3" id="editPostForm">

        <div
            class="col-md-8 col-lg-6 col-sm-12 mx-auto px-4 py-4 mt-5 mb-5 bs-white-color rounded-2"
        >
            <input
                type="text"
                class="form-control mt-0 border-0"
                id="headerInput"
                value="${post.title}"
                placeholder="Type in header"
                required
            />
            <textarea
                placeholder="Write something here..."
                name="message"
                id="textInput"
                rows="4"
                class="form-control mt-2 border-0"
                required
            >${post.body}</textarea>
            <div class="row">
                <div
                    class="mx-2 col-6 d-flex justify-content-center"
                >
                    <input
                        type="text"
                        class="form-control mt-0 border-0"
                        id="imageInput"
                        value="${post.media}"
                        placeholder="Image url (optional)">
                </div>
            </div>
            <div class="row">
                <div
                    class="mx-2 col-6 d-flex justify-content-center"
                >
                    <input
                        type="text"
                        class="form-control mt-0 border-0"
                        id="tagInput"
                        value="${tagsString}"
                        placeholder="tags (optional)">
                </div>
            </div>
            <div class="d-flex justify-content-end row">
                <button class="btn btn-primary col-3 text-white fw-bold mb-2" id="updateBtn">
                    Update
                </button>
            </div>
            <div class="row d-none" id="profileLink">
                <p class="col-10 mx-auto">Post updated.</p>
            </div>
        </div>
    </form>
    `;
}

function loadAndRenderPosts() {
    getPostsByUser(nameOfLoggedInUser).then(postsByUser => {
        const placeholderProfilePosts = document.querySelector("#placeholderProfilePosts");
        const listOfHtmlPosts = postsByUser.map(postByUser => {
            return `<div
            class="col-12 col-sm-6 mx-auto d-flex justify-content-center mb-5 grid gap-3"
          >
            <div class="bs-white-color px-4 rounded-2">
            <div class="d-flex justify-content-end">
            <button id="editBtn" class="mt-2 me-2 btn btn-primary px-3 text-white fw-bold" data-postId="${postByUser.id}">Update</button>
            <button id="deleteBtn" class="mt-2 btn btn-primary px-3 text-white fw-bold" data-postId="${postByUser.id}">Delete</button>
            <div id="deletePostPlaceholder" class="d-none alert alert-danger">Could not delete post, please try again later</div>
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
                }).catch(error => {
                    alert(error);
                });
            })
        })
        const editBtns = document.querySelectorAll("#editBtn");
        editBtns.forEach(btn => {
            const postId = btn.getAttribute("data-postId");
            btn.addEventListener("click", event => {
                getPostById(postId).then(post => {
                    let tagsString = "";
                    if(post.tags) {
                        tagsString = post.tags.join(",");
                    }
                    const editPostFormPlaceholder = document.querySelector("#placeholderEditForm");
                    editPostFormPlaceholder.innerHTML = composeUpdateFormHtml(post, tagsString)

                    const updateForm = document.querySelector("#editPostForm");
                    updateForm.addEventListener("submit", event => {
                        event.stopPropagation();
                        event.preventDefault();
                        const header = document.querySelector("#headerInput").value
                        const body = document.querySelector("#textInput").value
                        const image = document.querySelector("#imageInput").value
                        const tags = document.querySelector("#tagInput").value
                        let tagsAsList;
                        if(tags) {
                            tagsAsList = tags.split(",")
                        }
                        updatePost(postId, header, body, image, tagsAsList).then(successfulUpdate => {
                        if(successfulUpdate) {
                            editPostFormPlaceholder.innerHTML = "";
                            loadAndRenderPosts()
                        } else {
                            alert("could not update post, please try again later");
                        }
                        })
                    })
                })
            })
        })
    })
}

loadAndRenderPosts();

// legge til en delete knapp
// når man trykker på knappen skal man kunne slette posten
// legge til en eventlistener på knappen
// slette posten på serveren via api
//hvis det går bra å slette den, vise siden på nytt med postene




//legge til en update knapp
// opprett html knapp, med et attribut som er postId.
// når man trykker på rediger, skal det dukke opp en form, der man kan redigere posten
// eventlistener på knappen, lage en placeholder der man kan sette inn en form hvis knappet er trykket inn.

// når man lagrer endringene på posten skal det lagres på serveren via api'et.
// inne i formen legge til en lagre knapp, legge til event listner på denne
// når man har lagt inn endringen skal man kalle på updatePost funksjonen, slik at endringene blir laget på serveren.
// hvis det går bra skal posten vises på nytt på profil siden med den nye informasjonen
// kalle på funksjonen som henter alle postene på nytt
// går det dårlig, skal man få en melding om at det ikke gikk an å redigere posten akkuruat nå.
// lage en alert (placeholder error) som forteller at posten ikke kunne redigeres.

// Lage en placeholder hvor html kan settes inn
// kalle på get profileforname() funksjonen for å hente
// fra api'et skal man hente ut informasjon fra den brukeren som er logget inn sitt navn, avatar og antall følgere og hvor mange personen følger


const nameOfUser = localStorage.getItem("name");
getProfileForName(nameOfUser, false).then(profile => {
    const placeholderProfileInfo = document.querySelector("#placeholderProfileInfo");
    const html = ` <div class="d-flex justify-content-center">
            <img
              src="${profile.avatar}"
              alt="profile
        picture"
              class="img-fluid rounded-circle col-4 h-75 mw-50 object-fit-cover"
            />
            <div class="align-self-center ms-5">
              <h2 class="fw-bold">${profile.name}</h2>
            </div>
          </div>`;
    console.log(profile);
placeholderProfileInfo.innerHTML = html

    const placeholderCounters = document.querySelector("#placeholderCounters");
const htmlCounters = `<div class="d-flex mx-auto text-center col-lg-8 mt-4">
            <div class="col-4 fw-bolder">
              <p>${profile._count.posts}</p>
              <p>posts</p>
            </div>
            <div class="col-4 fw-bolder">
              <p>${profile._count.followers}</p>
              <p>Followers</p>
            </div>
            <div class="col-4 fw-bolder">
              <p>${profile._count.following}</p>
              <p>Following</p>
            </div>
          </div>`
    placeholderCounters.innerHTML = htmlCounters;



})