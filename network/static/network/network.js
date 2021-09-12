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
    document.querySelector('#all-posts').addEventListener('click', display_all_feed);
    
    // By default load all posts
    display_all_feed();
})


function display_all_feed() {

    document.querySelector('#all-posts').style.color = 'white';

    fetch_all_posts();

    document.querySelector('#postsAll').style.display = 'block';
    document.querySelector('#postsFollowing').style.display = 'none';
}

function display_following_feed() {
    document.querySelector('#postsAll').style.display = 'none';
    document.querySelector('#postsFollowing').style.display = 'block';
}


function fetch_all_posts() {
    fetch('/allposts')
    .then(response => response.json())
    .then(post => {
        post.forEach(eachPost)
    })

    function eachPost(element) {
        let user = document.querySelector('strong').innerText;
        let likeButton = document.querySelector(`#like-${element.id}`);
        
        // Fetches the 'like' status and count of each post
        fetch(`/likes/${element.id}`)
        .then(response => response.json())
        .then(likes => {
            
            // Number of likes
            let likeNum = likes.length;
    
            if (likes.some(like => like.liker == user)) {
                likeButton.style.color = '#eb4034';
                likeButton.addEventListener('click', () => unlikePost(element.id));
            }
            else {
                likeButton.style.color = '#000000';
                likeButton.addEventListener('click', () => likePost(element.id));
            }
    
            let likeCount = document.querySelector(`#like-count-${element.id}`)
            likeCount.innerHTML = `${likeNum}`;
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
    console.log(`User has liked post ${id}`);

    document.querySelector(`#like-${id}`).style.color = '#eb4034';

    const query = document.querySelector(`#like-count-${id}`)
    let likes = Number(query.innerText);
    likes = likes + 1;
    query.innerHTML = likes;

}


function unlikePost(id) {
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
    console.log(`User has unliked post ${id}`);
    
    document.querySelector(`#like-${id}`).style.color = '#000000';

    const query = document.querySelector(`#like-count-${id}`)
    let likes = Number(query.innerText);
    likes = likes - 1;
    query.innerHTML = likes;
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
        commenterElement.className = 'commenter';
        let commenter = document.createTextNode(`${element.commenter}`);
        commenterElement.appendChild(commenter);

        let commentElement = document.createElement('p');
        commentElement.className = 'comment';
        let comment = document.createTextNode(`${element.comment}`);
        commentElement.appendChild(comment);

        let breakline = document.createElement('hr');
        breakline.className = 'breakline-comment';

        body.appendChild(commentElement);
        body.appendChild(commenterElement);
        body.appendChild(breakline);

        let parent = document.querySelector(`#modal-body-parent-${element.post}`);
        parent.appendChild(body);
    }

    // Post Comment
    document.querySelector(`#comment-post-${ element.id }`).addEventListener('click', () => postComment(element.id))
}


function postComment(id) {
    let request = new Request(
        `/comments/${id}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    fetch(request, {
        method: 'POST',
        mode: 'same-origin',
        body: JSON.stringify({
            commenter: document.querySelector('strong').innerText,
            comment: document.querySelector(`#comment-field-${id}`).value,
            post: id
        })
    })
}

function editPost(element) {
    // Firstly, fetch the post's content
    fetch(`allposts/${element.id}`)
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
            `/allposts/${element.id}`,
            {headers: {'X-CSRFToken': csrftoken}}
        );
        // Then, take the edit field and post the data
        fetch(request, {
            method: 'PUT',
            mode: 'same-origin',
            body: JSON.stringify({
                post: document.querySelector(`#edit-field-${element.id}`).value
            })
        })
        location.reload();
    })
}