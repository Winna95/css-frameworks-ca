import {followUser, getAllProfiles, getProfileForName, unFollowUser} from "../js/profile-api.js";

const nameOfUser = localStorage.getItem("name")
const promises = [getProfileForName(nameOfUser, true), getAllProfiles()];

/**
 * Handles the logic for rendering user profiles and managing follow/unfollow actions.
 *
 * @param {Array<Promise>} promises - An array of promises containing user profile data.
 */
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
                            class="img-fluid rounded-circle mt-5 object-fit-cover user-img"
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
    /**
     * Handles the click event for the "Follow" button.
     *
     * @param {HTMLElement} btnElement - The button element representing the "Follow" button.
     */
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

    }
    /**
     * Handles the click event for the "Unfollow" button.
     *
     * @param {HTMLElement} btnElement - The button element representing the "Unfollow" button.
     */
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

    }

})

/**
 * Generates HTML for a follow/unfollow button based on the followed status.
 *
 * @param {boolean} followed - Indicates whether the user is followed.
 * @param {string} nameOfUser - The name of the user to follow/unfollow.
 * @returns {string} - The HTML for the follow/unfollow button.
 */
function generateFollowButtonHtml(followed, nameOfUser) {
    if(followed) {
       return `<button id="unfollowBtn" data-nameOfUser="${nameOfUser}" aria-pressed="true" data-bs-toggle="button" class="btn btn-primary active mt-4">Unfollow</button>`;
    } else {
        return `<button id="followBtn" data-nameOfUser="${nameOfUser}" data-bs-toggle="button" class="btn btn-primary mt-4">follow</button>`;
    }
}