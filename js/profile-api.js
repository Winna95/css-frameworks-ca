const baseUrl = "https://api.noroff.dev/api/v1";
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
    console.log(data);

    if(data.errors && data.errors.length > 0) {
        return [];
    }
    return data;
}
export async function getAllProfiles () {
    let url = baseUrl + `/social/profiles`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    console.log(data);

    if(data.errors && data.errors.length > 0) {
        return [];
    }
    return data;
}

export async function followUser(nameOfUserToFollow) {
    let url = baseUrl + `/social/profiles/${nameOfUserToFollow}/follow`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        method: "PUT",
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    console.log(data);

    if(data.errors && data.errors.length > 0) {
        return false;
    }
    return true;
}
export async function unFollowUser(nameOfUserToUnfollow) {
    let url = baseUrl + `/social/profiles/${nameOfUserToUnfollow}/unfollow`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
        method: "PUT",
        headers: {Authorization: "Bearer " + jwt}
    }

    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    console.log(data);

    if(data.errors && data.errors.length > 0) {
        return false;
    }
    return true;
}


