function getResponse(response) {
  return response.json();
}

function getResult(posts) {
  localStorage.setItem("posts", JSON.stringify(posts));
}

// ---------  NUOVO ------------
function appendComment(posts, postId, commentsContainer, comment, index) {
  const commentContainer = document.createElement("div");
  commentContainer.setAttribute("id", `post-item-${postId}-comment-${index}`);
  commentContainer.innerHTML = `
  <span style="color: green">${comment}</span>
  <button id='post-item-${postId}-comment-delete-${index}'>Elimina</button>`;
  commentsContainer.appendChild(commentContainer);

  document
    .getElementById(`post-item-${postId}-comment-delete-${index}`)
    .addEventListener("click", () => {
      document.getElementById(`post-item-${postId}-comment-${index}`).remove();

      const updatedPosts = posts.map((post) => {
        if (post.id === postId) {
          post.comments.splice(index, 1);
        }
        return post;
      });
      localStorage.setItem("posts", JSON.stringify(updatedPosts));
    });
}
// ----------------------------

window.onload = function () {
  const posts = !!localStorage.getItem("posts")
    ? JSON.parse(localStorage.getItem("posts"))
    : null;
  if (!!posts) {
    for (let i = 0; i < posts.length; i++) {
      const post = posts[i];
      const newNode = document.createElement("div");
      newNode.setAttribute("id", `post-item-${post.id}`);
      newNode.innerHTML = `
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <input type="text" id='input-comment-${post.id}' placeholder='scrivi qui' />
                <button id='button-comment-${post.id}'>Commenta</button>
                <button id='button-delete-${post.id}'>Elimina</button>`;
      document.getElementById("post-list").appendChild(newNode);

      // ---------  NUOVO ------------
      const commentsContainer = document.createElement("div");
      commentsContainer.setAttribute("id", `post-item-${post.id}-comments`);
      newNode.appendChild(commentsContainer);
      if (!!post.comments) {
        for (let j = 0; j < post.comments.length; j++) {
          const comment = post.comments[j];
          appendComment(posts, post.id, commentsContainer, comment, j);
        }
      }
      document
        .getElementById(`button-comment-${post.id}`)
        .addEventListener("click", () => {
          const input = document.getElementById(`input-comment-${post.id}`);
          const newComment = input.value;
          if (!!newComment) {
            appendComment(
              posts,
              post.id,
              commentsContainer,
              newComment,
              post.comments?.length || 0
            );
            input.value = "";

            if (!!post.comments) {
              post.comments.push(newComment);
            } else {
              post.comments = [newComment];
            }
            localStorage.setItem("posts", JSON.stringify(posts));
          }
        });
      // ------------------------------------

      document
        .getElementById(`button-delete-${post.id}`)
        .addEventListener("click", () => {
          const filteredPosts = posts.filter((p) => p.id !== post.id);
          localStorage.setItem("posts", JSON.stringify(filteredPosts));
          document.getElementById(`post-item-${post.id}`).remove();
        });
    }
  } else {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then(getResponse)
      .then(getResult);
  }
};
