const baseUrl = "https://api.noroff.dev/api/v1";

export async function getPostsFromFollowed () {


      const url = baseUrl + "/social/posts/following?_author=true";
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


export async function createPost (title, postText, tags, pictureUrl) {
   
    const url = baseUrl + "/social/posts";
    const jwt = localStorage.getItem("jwt")
    let requestBody = {
        title: title,
        body: postText
    }
    if (tags && tags === Array.isArray(tags) ) {
        requestBody.tags = tags
    };
    if (pictureUrl) {
        requestBody.media = pictureUrl
    };
    
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
    console.log(data);
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return true;
}

export async function getPostsByUser (nameOfUser) {
   
    const url = baseUrl + `/social/profiles/${nameOfUser}/posts`;
    const jwt = localStorage.getItem("jwt")
    const fetchOptions = {
      headers: {
         Authorization: "Bearer " + jwt       
        }
    }
    
    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    console.log(data);
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return data;
}

export async function updatePost (id, title, postText, tags, pictureUrl) {
   
    const url = baseUrl + `/social/posts/${id}`;
    const jwt = localStorage.getItem("jwt");
    let requestBody = {
        title: title,
        body: postText
    }
    if (tags && tags === Array.isArray(tags) ) {
        requestBody.tags = tags
    };
    if (pictureUrl) {
        requestBody.media = pictureUrl
    };
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
    console.log(data);
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return true;
}


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
    console.log(data);
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return true;
}

export async function getPostById (id) {
   
    const url = baseUrl + `/social/posts/${id}`;
    const jwt = localStorage.getItem("jwt");

    const fetchOptions = {
      headers: {
         Authorization: "Bearer " + jwt       
        }
    };
    
    const response = await fetch(url, fetchOptions);

    const data = await response.json();
    console.log(data);
    
    if(data.errors && data.errors.length > 0) {
      return false;
    } 
    return data;
}

