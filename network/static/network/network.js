// FOR CSRF TOKEN: src: https://docs.djangoproject.com/en/3.2/ref/csrf/
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
// Declare CSRF Token
const csrftoken = getCookie('csrftoken');

document.addEventListener('DOMContentLoaded', () => {
    // For all posts
    document.querySelector('#all-posts').addEventListener('click', display_all_feed);

    // Set href
    let view_profile = document.querySelector('#view-profile');
    let username = document.querySelector('strong').innerText;
    view_profile.href = `/viewprofile/${username}`;
    
    // By default load all posts
    display_all_feed();
})


function display_all_feed() {

    document.querySelector('#all-posts').style.color = 'white';

    fetch_all_posts();

    document.querySelector('#postsAll').style.display = 'block';
}


function fetch_all_posts() {
    fetch('/allposts')
    .then(response => response.json())
    .then(post => {
        post.forEach(eachPost);
    })

    function eachPost(element) {
        let user = document.querySelector('strong').innerText;
        var likeDiv = document.querySelector(`.like-div-${element.id}`);
        
        // Fetches the 'like' status and count of each post
        fetch(`/likes/${element.id}`)
        .then(response => response.json())
        .then(likes => {
            
            // Number of likes
            var likeNum = likes.length;
    
            if (likes.some(like => like.liker == user)) {
                likeDiv.innerHTML = `<i id="like-${ element.id }" class="far fa-thumbs-up"></i> <h5 class="like-count" id="like-count-${ element.id }"></h5>`;
                let likeButton = document.querySelector(`#like-${ element.id }`);
                likeButton.style.color = 'red';
                likeButton.addEventListener('click', () => unlikePost(element.id));
            }
            else {
                likeDiv.innerHTML = `<i id="like-${ element.id }" class="far fa-thumbs-up"></i> <h5 class="like-count" id="like-count-${ element.id }"></h5>`;
                let unlikeButton = document.querySelector(`#like-${ element.id }`);
                unlikeButton.style.color = 'black';
                unlikeButton.addEventListener('click', () => likePost(element.id))
            }
    
            let likeCount = document.querySelector(`#like-count-${element.id}`)
            likeCount.innerHTML = likeNum;
        })
        .catch(error => {
            console.log(error);
        })

        // Fetches comments of the post and its count
        fetch(`/comments/${element.id}`)
        .then(response => response.json())
        .then(comments => {

            // Hide 'no comments'
            document.querySelector(`#modal-body-empty-${ element.id }`).style.display = 'none';

            // Number of comments
            let commentNum = comments.length;
            let commentsNumField = document.querySelector(`#comment-count-${ element.id }`);
            commentsNumField.innerHTML = commentNum;

            // On click to comment on post (Displays overlay div)
            let toComment = document.querySelector(`#comment-${ element.id }`);
            toComment.setAttribute('data-bs-toggle', 'modal');
            toComment.setAttribute('data-bs-target', `#modal-${ element.id }`);
            toComment.addEventListener('click', () => {

                if (document.querySelector(`#modal-body-${element.id}`) != null) {
                    document.querySelector(`#modal-body-${element.id}`).style.display = 'block';
                }
                else {
                    viewComment(element);
                }
            })
        })
        .catch(error => {
            console.log(error);
        })

        // Edit comment
        if (document.querySelector(`#edit-${element.id}`) != null) {
            let editButton = document.querySelector(`#edit-${element.id}`)
            editButton.setAttribute('data-bs-toggle', 'modal');
            editButton.setAttribute('data-bs-target', `#modal-edit-${element.id}`);
            editButton.addEventListener('click', () => editPost(element));
        }
        
    }
}

function likePost(id) {
    var likeDiv = document.querySelector(`.like-div-${id}`);
    let request = new Request(
        `/likes/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    fetch(request, {
        method: 'POST',
        mode: 'same-origin',
        body: JSON.stringify({
            liker: document.querySelector('strong').innerText,
            post: id
        })
    })
    .then(() => {
        let currentlikeCount = document.querySelector(`#like-count-${ id }`).innerText;
        likeDiv.innerHTML = `<i id="like-${ id }" class="far fa-thumbs-up"></i> <h5 class="like-count" id="like-count-${ id }"></h5>`;
        let likeButton = document.querySelector(`#like-${ id }`);
        likeButton.style.color = 'red';

        let newlikeCount = Number(currentlikeCount) + 1;
        
        document.querySelector(`#like-count-${id}`).innerHTML = newlikeCount;
        likeButton.addEventListener('click', () => unlikePost(id));
        console.log(`User ${document.querySelector('strong').innerText} has liked post ${id}`);
        console.log(newlikeCount);
    })
}


function unlikePost(id) {
    var likeDiv = document.querySelector(`.like-div-${id}`);
    let request = new Request(
        `/likes/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    fetch(request, {
        method: 'DELETE',
        mode: 'same-origin',
        body: JSON.stringify({
            liker: document.querySelector('strong').innerText,
            post: id
        })
    })
    .then(() => {
        let currentlikeCount = document.querySelector(`#like-count-${ id }`).innerHTML;

        likeDiv.innerHTML = `<i id="like-${ id }" class="far fa-thumbs-up"></i> <h5 class="like-count" id="like-count-${ id }"></h5>`;
        let unlikeButton = document.querySelector(`#like-${ id }`);
        unlikeButton.style.color = 'black';
        let newlikeCount = Number(currentlikeCount) - 1;
        document.querySelector(`#like-count-${id}`).innerHTML = newlikeCount;
        unlikeButton.addEventListener('click', () => likePost(id));
        console.log(`User ${document.querySelector('strong').innerText} has unliked post ${id}`);
        console.log(newlikeCount);
    })
}


// Will create new comment
function viewComment(element) {
    // Title
    let title = document.querySelector(`.modal-title-${element.id}`)
    title.innerText = `Comments on ${element.op}'s post`;

    // Load Comments
    fetch(`/comments/${element.id}`)
    .then(response => response.json())
    .then(comments => {
        if (comments.length == 0) {
            document.querySelector(`#modal-body-empty-${ element.id }`).style.display = 'block';
        }
        else {
            comments.forEach(eachComment);
        }
    })
    .catch(error => {
        console.log(error);
    })

    function eachComment(element) {

        let body = document.createElement('div');
        body.id = `modal-body-${ element.post }`;

        let commenterElement = document.createElement('h5');
        commenterElement.className = 'commenter-ele';
        let commenter = document.createTextNode(`${element.commenter}`);
        commenterElement.appendChild(commenter);

        let commentElement = document.createElement('p');
        commentElement.className = 'comment-ele';
        let comment = document.createTextNode(`${element.comment}`);
        commentElement.appendChild(comment);

        let timestampElement = document.createElement('p');
        timestampElement.className = 'timestamp-ele';
        let timestamp = document.createTextNode(`${element.timestamp}`);
        timestampElement.appendChild(timestamp);

        let breakline = document.createElement('hr');
        breakline.className = 'breakline-comment';

        body.appendChild(commenterElement);
        body.appendChild(commentElement);
        body.appendChild(timestampElement);
        body.appendChild(breakline);

        let parent = document.querySelector(`#modal-body-parent-${element.post}`);
        parent.appendChild(body);
    }

    // Post Comment
    document.querySelector(`#comment-post-${ element.id }`).addEventListener('click', () => postComment(element))
}


function postComment(element) {
    let request = new Request(
        `/comments/${element.id}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    fetch(request, {
        method: 'POST',
        mode: 'same-origin',
        body: JSON.stringify({
            commenter: document.querySelector('strong').innerText,
            comment: document.querySelector(`#comment-field-${element.id}`).value,
            post: element.id
        })
    })
    .then(() => {
        let parent = document.querySelector(`#modal-body-parent-${element.id}`);
        let commentDiv = document.createElement('div');
        commentDiv.id = `modal-body-${element.id}`;

        let commenterElement = document.createElement('h5');
        commenterElement.className = 'commenter-ele';
        let commenter = document.createTextNode(`${document.querySelector('strong').innerText}`);
        commenterElement.appendChild(commenter);

        let commentElement = document.createElement('p');
        commentElement.className = 'comment-ele';
        let comment = document.createTextNode(`${document.querySelector(`#comment-field-${element.id}`).value}`);
        commentElement.appendChild(comment);

        let timestampElement = document.createElement('p');
        timestampElement.className = 'timestamp-ele';
        let timestamp = document.createTextNode(`${element.timestamp}`);
        timestampElement.appendChild(timestamp);

        let breakline = document.createElement('hr');
        breakline.className = 'breakline-comment';

        commentDiv.appendChild(commenterElement);
        commentDiv.appendChild(commentElement);
        commentDiv.appendChild(timestampElement);
        commentDiv.appendChild(breakline);

        parent.appendChild(commentDiv);

        document.querySelector(`#comment-field-${element.id}`).value = '';

        // Asynchronously update comment count
        let comment_count = document.querySelector(`#comment-count-${element.id}`).innerText;
        let new_count = Number(comment_count) + 1;
        document.querySelector(`#comment-count-${element.id}`).innerHTML = new_count;
    })
}

function editPost(element) {
    // Firstly, fetch the post's content
    fetch(`post/${element.id}`)
    .then(response => response.json())
    .then(post => {
        let content = post.post;
        let editField = document.querySelector(`#edit-field-${post.id}`);
        editField.innerHTML = content;
    })
    .catch(error => {
        console.log(error);
    })
    let submitButton = document.querySelector(`#edit-post-button-${element.id}`);
    submitButton.addEventListener('click', () => {
        let request = new Request(
            `/post/${element.id}`,
            {headers: {'X-CSRFToken': csrftoken}}
        );
        let post = document.querySelector(`#edit-field-${element.id}`).value;
        // Prevent empty edits
        if (post === '') {
            let originalContent = document.querySelector(`#post-content-${element.id}`).innerText;
            // If field is empty, set it to what the user has posted initially.
            fetch(request, {
                method: 'PUT',
                mode: 'same-origin',
                body: JSON.stringify({
                    post: originalContent
                })
            })
            .then(() => {
                document.querySelector(`#post-content-${element.id}`).innerHTML = originalContent;
                document.querySelector(`#btn-close-edit-${element.id}`).click();
            })
        }
        else {
            // Then, take the edit field and post the data
            fetch(request, {
                method: 'PUT',
                mode: 'same-origin',
                body: JSON.stringify({
                    post: document.querySelector(`#edit-field-${element.id}`).value
                })
            })
            .then(() => {
                document.querySelector(`#post-content-${element.id}`).innerHTML = document.querySelector(`#edit-field-${element.id}`).value;
                document.querySelector(`#btn-close-edit-${element.id}`).click();
            })
        }
    })
}