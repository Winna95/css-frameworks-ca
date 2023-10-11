const baseUrl = "https://api.noroff.dev/api/v1";

/**
 * Retrieves posts from followed users on the social platform based on an optional tag filter.
 *
 * @param {string} tag - Optional tag to filter the posts by.
 * @returns {Promise<Array>} An array of post objects if successful; otherwise, an empty array.
 */
export async function getPostsFromFollowed (tag) {


      let url = baseUrl + "/social/posts/following?_author=true&_active=true`";
    if(tag) {
        url = url + `&_tag=${tag}`
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
 * Creates a new post on the social platform with the provided information.
 *
 * @param {string} title - The title of the post.
 * @param {string} postText - The main text content of the post.
 * @param {Array<string>} tags - An array of tags associated with the post (optional).
 * @param {string} pictureUrl - The URL of an image associated with the post (optional).
 * @returns {Promise<boolean>} `true` if the post creation is successful; otherwise, `false`.
 */
export async function createPost (title, postText, tags, pictureUrl) {
   
    const url = baseUrl + "/social/posts";
    const jwt = localStorage.getItem("jwt")
    let requestBody = {
        title: title,
        body: postText
    }
    if (tags && Array.isArray(tags) ) {
        requestBody.tags = tags;
    }
    if (pictureUrl) {
        requestBody.media = pictureUrl;
    }
    
    const fetchOptions = {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
         Authorization: "Bearer " + jwt       
        },
      body: JSON.stringify(requestBody)
    }
    
    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return true;
}

/**
 * Retrieves posts created by a specific user based on their username.
 *
 * @param {string} nameOfUser - The username of the user whose posts to retrieve.
 * @throws {Error} If there is an error during the retrieval process.
 * @returns {Promise<Object>} An object containing user-specific posts if successful; otherwise, an error is thrown.
 */
export async function getPostsByUser (nameOfUser) {
   
    let url = baseUrl + `/social/profiles/${nameOfUser}/posts`;
    
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
      headers: {
         Authorization: "Bearer " + jwt       
        }
    }
    
    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    
    if(data.errors && data.errors.length > 0) {
      throw new Error(data.errors.join(" "));
    } 
    return data;
}

/**
 * Updates an existing post on the social platform with the provided information.
 *
 * @param {string} id - The unique identifier of the post to update.
 * @param {string} title - The updated title of the post.
 * @param {string} postText - The updated main text content of the post.
 * @param {Array<string>} tags - An array of updated tags associated with the post (optional).
 * @param {string} pictureUrl - The updated URL of an image associated with the post (optional).
 * @returns {Promise<boolean>} `true` if the post update is successful; otherwise, `false`.
 */
export async function updatePost (id, title, postText, tags, pictureUrl) {
   
    const url = baseUrl + `/social/posts/${id}`;
    const jwt = localStorage.getItem("jwt");
    let requestBody = {
        title: title,
        body: postText
    }
    if (tags && tags === Array.isArray(tags) ) {
        requestBody.tags = tags;
    }
    if (pictureUrl) {
        requestBody.media = pictureUrl;
    }
    const fetchOptions = {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json',
         Authorization: "Bearer " + jwt       
        },
       body: JSON.stringify(requestBody) 
    };
    
    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return true;
}

/**
 * Deletes an existing post on the social platform with the provided post ID.
 *
 * @param {string} id - The unique identifier of the post to delete.
 * @returns {Promise<boolean>} `true` if the post deletion is successful; otherwise, `false`.
 */
export async function deletePost (id) {
   
    const url = baseUrl + `/social/posts/${id}`;
    const jwt = localStorage.getItem("jwt");

    const fetchOptions = {
      method: "DELETE",
      headers: {
         Authorization: "Bearer " + jwt       
        }
    };
    
    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return true;
}

/**
 * Retrieves a post from the social platform by its id.
 *
 * @param {string} id - The id of the post to retrieve.
 * @param includeAuthor
 * @returns {Promise<Object|boolean>} The post object if retrieval is successful; otherwise, `false`.
 */
export async function getPostById (id, includeAuthor) {
   
    let url = baseUrl + `/social/posts/${id}`;
    if (includeAuthor) {
        url = url + `?_author=true`;
    }
    const jwt = localStorage.getItem("jwt");

    const fetchOptions = {
      headers: {
         Authorization: "Bearer " + jwt       
        }
    };
    
    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return data;
}

