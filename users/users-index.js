import {followUser, getAllProfiles, getProfileForName, unFollowUser} from "../js/profile-api.js";

const nameOfUser = localStorage.getItem("name")
const promises = [getProfileForName(nameOfUser, true), getAllProfiles()];
Promise.all(promises).then((responses) => {
    const profileForName = responses[0];
    const allProfiles = responses[1];
    const namesOfUsersFollowed = profileForName.following.map(followingUser => {
        return followingUser.name
    });
    const allProfilesWithFollowingInfo = allProfiles.map(profile => {
        if(namesOfUsersFollowed.indexOf(profile.name) !== -1) {
            profile.isFollowing = true;
        } else {
            profile.isFollowing = false;
        }
        return profile;
    })
    const userPlaceholder = document.querySelector("#placeholderUsers");
    const htmlForProfiles = allProfilesWithFollowingInfo.map(profile => {
        return `<div
                    class="col-12 col-sm-6 mx-auto d-flex justify-content-center mb-5 grid gap-3"
            >
                <div class="row">

                <div class="d-flex justify-content-center col-5">
                    <img
                            src="${profile.avatar}"
                            alt="profile picture"
                            class="img-fluid rounded-circle h-75 mt-5"
                    />
                </div>
                    <div class="col-7">
                    <h2 class="mt-5">${profile.name}</h2>
                    <div>${generateFollowButtonHtml(profile.isFollowing, profile.name)}</div>
                    </div>
                </div>

            </div>`
    });
   userPlaceholder.innerHTML = htmlForProfiles.join(" ");
   const allUnfollowBtns = document.querySelectorAll("#unfollowBtn");
   const allFollowBtns = document.querySelectorAll("#followBtn");

   allFollowBtns.forEach(followBtn => {
       followBtn.addEventListener("click",event => followClickHandler(followBtn));
   });

    allUnfollowBtns.forEach(unFollowBtn => {
        unFollowBtn.addEventListener("click",event => unfollowClickHandler(unFollowBtn))
   })

    function followClickHandler(btnElement) {
        const nameOfUser = btnElement.getAttribute('data-nameOfUser')
        followUser(nameOfUser).then(successfulFollowing => {
            if(successfulFollowing) {
                btnElement.classList.add("active");
                btnElement.setAttribute("aria-pressed", "true");
                btnElement.innerHTML = "Unfollow";
                const cloned = btnElement.cloneNode(true);
                btnElement.replaceWith(cloned);
                cloned.addEventListener('click', event => unfollowClickHandler(cloned));
            } else {
                alert("unable to follow user, please try again later")
            }
        })
        console.log("hei");
    }
    function unfollowClickHandler(btnElement) {
        const nameOfUser = btnElement.getAttribute('data-nameOfUser')
        unFollowUser(nameOfUser).then(successfulUnFollowing => {
            if(successfulUnFollowing) {
                // her har det gått bra
                btnElement.classList.remove("active");
                btnElement.innerHTML = "Follow";
                btnElement.removeAttribute("aria-pressed");
                const cloned = btnElement.cloneNode(true)
                btnElement.replaceWith(cloned);
                cloned.addEventListener('click', event => followClickHandler(cloned));
            } else {
                alert("unable to Unfollow user, please try again later")
            }
        })
        console.log("hei");
    }

})


function generateFollowButtonHtml(followed, nameOfUser) {
    if(followed) {
       return `<button id="unfollowBtn" data-nameOfUser="${nameOfUser}" aria-pressed="true" data-bs-toggle="button" class="btn btn-primary active mt-4">Unfollow</button>`;
    } else {
        return `<button id="followBtn" data-nameOfUser="${nameOfUser}" data-bs-toggle="button" class="btn btn-primary mt-4">follow</button>`;
    }
}