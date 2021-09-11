document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#all-posts').addEventListener('click', display_feed);
    
    // By default load all posts
    display_feed();
})


function display_feed() {

    fetch_all_posts();

    document.querySelector('#newsfeed-all').style.display = 'block';
    document.querySelector('#newsfeed-following').style.display = 'none';
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
    fetch(`/likes/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
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
    fetch(`/likes/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json' 
        },
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
    fetch(`/comments/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            commenter: document.querySelector('strong').innerText,
            comment: document.querySelector(`#comment-field-${id}`).value,
            post: id
        })
    })
    document.querySelector(`#comment-field-${id}`).value = '';
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

    let submitButton = document.querySelector(`#edit-post-button-${element.id}`);

    submitButton.addEventListener('click', () => {
        // Then, take the edit field and post the data
        fetch(`allposts/${element.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                post: document.querySelector(`#edit-field-${element.id}`).value
            })
        })
        location.reload();
    })
}