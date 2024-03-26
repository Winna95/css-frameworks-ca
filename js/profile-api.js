const baseUrl = "https://api.noroff.dev/api/v1";

/**
 * Retrieves a user's profile information by their name.
 *
 * @param {string} name - The name of the user whose profile to retrieve.
 * @param {boolean} includeFollowing - Whether to include the user's following list in the profile (optional).
 * @returns {Promise<Object|Array>} The user's profile object if retrieval is successful; otherwise, an empty array.
 */
export async function getProfileForName (name, includeFollowing) {
    let url = baseUrl + `/social/profiles/${name}`;
    if(includeFollowing) {
        url = url + `?_following=true`;
    }
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return [];
    }
    return data;
}

/**
 * Retrieves a list of all user profiles from the social platform.
 *
 * @returns {Promise<Array>} An array of user profile objects if retrieval is successful; otherwise, an empty array.
 */
export async function getAllProfiles () {
    let url = baseUrl + `/social/profiles`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return [];
    }
    return data;
}

/**
 * Follows a user on the social platform by their username.
 *
 * @param {string} nameOfUserToFollow - The username of the user to follow.
 * @returns {Promise<boolean>} `true` if the follow operation is successful; otherwise, `false`.
 */
export async function followUser(nameOfUserToFollow) {
    let url = baseUrl + `/social/profiles/${nameOfUserToFollow}/follow`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        method: "PUT",
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return false;
    }
    return true;
}

/**
 * Unfollows a user on the social platform by their username.
 *
 * @param {string} nameOfUserToUnfollow - The username of the user to unfollow.
 * @returns {Promise<boolean>} `true` if the unfollow operation is successful; otherwise, `false`.
 */
export async function unFollowUser(nameOfUserToUnfollow) {
    let url = baseUrl + `/social/profiles/${nameOfUserToUnfollow}/unfollow`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        method: "PUT",
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();

    if(data.errors && data.errors.length > 0) {
        return false;
    }
    return true;
}


