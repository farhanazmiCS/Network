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
    // Loads personal profile
    document.querySelector('#view-profile').addEventListener('click', load_profile);

    // Set href
    let view_profile = document.querySelector('#view-profile');
    let logged = document.querySelector('strong').innerText;
    view_profile.href = `/viewprofile/${logged}`;

    // By default, load user's profile
    load_profile()
})


function load_profile() {
    // Get username from URL
    let ref = location.href;
    var username = ref.slice(34);

    // Fetch follower / following data
    let user2_data = fetch(`/profiles/${username}`)
    .then(response => response.json())
    .then(user2 => {
        // Insert follower / following data
        let follower_element = document.querySelector('#title-content-followers');
        let following_element = document.querySelector('#title-content-following');
        follower_element.innerHTML = user2.follower_count;
        following_element.innerHTML = user2.following_count;

        // Insert username
        let username_element = document.querySelector('#username-profile-child');
        username_element.innerHTML = username;

        let user2_follower_following = {
            followers: user2.followers,
            following: user2.following,
            follower_count: user2.follower_count,
            following_count: user2.following.count
        };
        return user2_follower_following;
    })
    .catch(error => {
        console.log(error);
    })

    // Get posts data
    fetch(`/posts/${username}`)
    .then(response => response.json())
    .then(posts => {
        // Load each post
        posts.forEach(post);
        
        // Insert post count data
        let post_count = posts.length;
        let post_count_element = document.querySelector('#title-content-post');
        post_count_element.innerHTML = post_count;
    })
    .catch(error => {
        console.log(error);
    })

    // Follow button
    if (username === document.querySelector('strong').innerText) {
        document.querySelector('#follow-button').style.display = 'none';
    }
    else {
        document.querySelector('#header-posts').innerHTML = `${username}'s Posts`;
        // User 2 is the profile that is being viewed (Not logged-in user)
        user2_data.then(user2 => {

            let user2_followers = user2.followers;

            // If user_2's follower list includes user_1's (logged-in user)
            if (user2_followers.includes(document.querySelector('strong').innerText)) {
                
                // Display a different button if the user is already being followed by the logged-on user
                let buttonDiv = document.querySelector('#follow-div');
                buttonDiv.innerHTML = `<button type="button" id="following-button" class="btn btn-outline-primary">Following</button>`
                
            }
            // Data of User2
            let user2_follower_following = {
                followers: user2.followers,
                following: user2.following,
                follower_count: user2.follower_count,
                following_count: user2.following.count
            };
            return user2_follower_following;
        })

        // User 1 is the profile that is being logged in.
        let user1_data = fetch(`/profiles/${document.querySelector('strong').innerText}`)
        .then(response => response.json())
        .then(user1 => {
            // Data of User1
            let user1_followers_following = {
                followers: user1.followers,
                following: user1.following,
                follower_count: user1.follower_count,
                following_count: user1.following.count
            };
            return user1_followers_following;
        })

        // User 1's following data and User 2's followers data
        Promise.all([user1_data, user2_data]).then(data => {
            // On click event to FOLLOW user
            if (document.querySelector('#follow-button') !== null) {
                let button = document.querySelector('#follow-button');
                button.addEventListener('click', () => follow(data, username))
            }
            else if (document.querySelector('#following-button') !== null) {
                let followDiv = document.querySelector('#follow-div')
                followDiv.innerHTML = `<button type="button" id="following-button" class="btn btn-outline-primary">Following</button>`
                let button = document.querySelector('#following-button');
                button.addEventListener('click', () => unfollow(data, username))
            }
        })
    }
}

function post(each) {
    // Create new div called 'post-element', to contain each post data
    let post_element = document.createElement('div');
    post_element.className = 'post-element';
    post_element.id = each.id;

    // Append each post_element to '#my-posts'
    let my_posts = document.querySelector('#my-posts');
    my_posts.appendChild(post_element);

    let user = document.querySelector('strong').innerText

    // Content of div
    post_element.innerHTML = `<a href="/viewprofile/${each.op}"><h4 id="post-original-poster-${ each.id }">${ each.op }</h4></a>
    <p id="post-content-${ each.id }">${ each.post }</p>
    <p class="timestamp">Posted on ${ each.timestamp }</p>
    <div class="total-likes-${ each.id }">
        <div class="like-div-${ each.id }">
        </div>
        <i id="comment-${ each.id }" class="fas fa-comment" data-bs-toggle="modal" data-bs-target="#modal-comment-${ each.id }"></i> <h5 class="comment-count" id="comment-count-${ each.id }"></h5>
        <h5 id="edit-${ each.id }" class="edit" data-bs-toggle="modal" data-bs-target="#modal-edit-${ each.id }">Edit</h5>
    </div>
    <hr>`

    let body = document.querySelector('.body');
    let modal_fade_edit = document.createElement('div');
    // Modal attributes (Edit)
    modal_fade_edit.className = 'modal fade';
    modal_fade_edit.id = `modal-edit-${each.id}`;
    modal_fade_edit.setAttribute('tabindex', '-1');
    modal_fade_edit.setAttribute('aria-labelledby', 'exampleModalLabel');
    modal_fade_edit.setAttribute('aria-hidden', 'true');
    // Append modal into body
    body.appendChild(modal_fade_edit);
    
    // Modal Dialogue (Edit)
    let modal_dialog = document.createElement('div');
    modal_dialog.className = 'modal-dialog modal-dialog-scrollable';
    modal_fade_edit.appendChild(modal_dialog);

    // Modal Content (Edit)
    let modal_content = document.createElement('div');
    modal_content.id = `modal-content-edit-${each.id}`;
    modal_content.className = 'modal-content';
    modal_dialog.appendChild(modal_content);
    modal_content.innerHTML = `<div class="modal-header">
    <h5 class="modal-title-edit-${ each.id }" id="staticBackdropLabel" style="margin-bottom: 0px;">Edit Post</h5>
    <button id="btn-close-edit-${ each.id }"type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="margin-bottom: 0px;"></button>
    </div>
    <div class="modal-body" id="modal-body-parent-edit-${ each.id }">
    <div class="mb-3">
        <textarea class="form-control" id="edit-field-${ each.id }" rows="3"></textarea>
    </div>
    <div class="d-grid gap-2">
        <button id="edit-post-button-${ each.id }" class="btn btn-primary" type="button">Edit</button>
    </div>
    </div>`;

    if (document.querySelector('strong').innerText != document.querySelector(`#post-original-poster-${ each.id }`).innerHTML) {
        document.querySelector(`#edit-${ each.id }`).style.display = 'none';
    }
    else {
        // Edit Button
        document.querySelector(`#edit-${ each.id }`).style.display = 'inline-block';
        document.querySelector(`#edit-${ each.id }`).addEventListener('click', () => editPost(each));
    }

    let modal_fade_comment = document.createElement('div');
    // Modal attributes (Comment)
    modal_fade_comment.className = 'modal fade';
    modal_fade_comment.id = `modal-comment-${each.id}`;
    modal_fade_comment.setAttribute('tabindex', '-1');
    modal_fade_comment.setAttribute('aria-labelledby', 'exampleModalLabel');
    modal_fade_comment.setAttribute('aria-hidden', 'true');

    // Append modal (comments) into body
    body.appendChild(modal_fade_comment);

    // Modal (comment) dialogue
    let modal_dialog_comment = document.createElement('div');
    modal_dialog_comment.className = 'modal-dialog modal-dialog-scrollable';
    modal_fade_comment.appendChild(modal_dialog_comment);

    // Modal Content (Comment)
    let modal_content_comment = document.createElement('div');
    modal_content_comment.id = `modal-content-comment-${each.id}`;
    modal_content_comment.className = 'modal-content';
    modal_dialog_comment.appendChild(modal_content_comment);
    modal_content_comment.innerHTML = `<div class="modal-header">
    <h5 class="modal-title-${ each.id }" id="staticBackdropLabel" style="margin-bottom: 0px;"></h5>
    <button id="btn-close-${ each.id }"type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="margin-bottom: 0px;"></button>
    </div>
    <div class="modal-body" id="modal-body-parent-${ each.id }">
    <div id="modal-body-empty-${ each.id }">
        No comments :/
    </div>
    </div>
    <div id="modal-footer-${ each.id }" class="modal-footer">
    <div class="input-group mb-0">
        <input type="text" id="comment-field-${ each.id }" class="form-control" placeholder="Your Comment" aria-label="Recipient's username" aria-describedby="button-addon2">
        <button id="comment-post-${ each.id }" class="btn btn-primary" type="button">Comment</button>
    </div>
    </div>`;

    // Fetches comments of the post and its count
    fetch(`/comments/${each.id}`)
    .then(response => response.json())
    .then(comments => {

        // Hide 'no comments'
        document.querySelector(`#modal-body-empty-${ each.id }`).style.display = 'none';

        // Number of comments
        let commentNum = comments.length;
        let commentsNumField = document.querySelector(`#comment-count-${ each.id }`);
        commentsNumField.innerHTML = commentNum;

        // On click to comment on post (Displays overlay div)
        let toComment = document.querySelector(`#comment-${ each.id }`);
        toComment.setAttribute('data-bs-toggle', 'modal');
        toComment.setAttribute('data-bs-target', `#modal-comment-${ each.id }`);
        toComment.addEventListener('click', () => {

            if (document.querySelector(`#modal-body-${each.id}`) != null) {
                document.querySelector(`#modal-body-${each.id}`).style.display = 'block';
            }
            else {
                viewComment(each);
            }
        })
    })
    .catch(error => {
        console.log(error);
    })

    // Like function
    fetch(`/likes/${each.id}`)
    .then(res => res.json())
    .then(likes => {
        // Number of likes
        var likeNum = likes.length;
        var likeDiv = document.querySelector(`.like-div-${each.id}`);
    
        if (likes.some(like => like.liker === user)) {
            likeDiv.innerHTML = `<i id="like-${ each.id }" class="far fa-thumbs-up"></i> <h5 class="like-count" id="like-count-${ each.id }"></h5>`;
            let likeButton = document.querySelector(`#like-${ each.id }`);
            likeButton.style.color = 'red';
            likeButton.addEventListener('click', () => unlikePost(each.id));
        }
        else {
            likeDiv.innerHTML = `<i id="like-${ each.id }" class="far fa-thumbs-up"></i> <h5 class="like-count" id="like-count-${ each.id }"></h5>`;
            let unlikeButton = document.querySelector(`#like-${ each.id }`);
            unlikeButton.style.color = 'black';
            unlikeButton.addEventListener('click', () => likePost(each.id))
        }

        let likeCount = document.querySelector(`#like-count-${each.id}`)
        likeCount.innerHTML = likeNum;
    })
    .catch(error => {
        console.log(error);
    })
}

function editPost(post) {
    // Firstly, fetch the post's content
    fetch(`/post/${post.id}`)
    .then(response => response.json())
    .then(post => {
        let content = post.post;
        let editField = document.querySelector(`#edit-field-${post.id}`);
        editField.innerHTML = content;
    })
    .catch(error => {
        console.log(error);
    })

    let submitButton = document.querySelector(`#edit-post-button-${post.id}`);
    submitButton.addEventListener('click', () => {
        let request = new Request(
            `/post/${post.id}`,
            {headers: {'X-CSRFToken': csrftoken}}
        );
        let edited = document.querySelector(`#edit-field-${post.id}`).value;
        // Prevent empty edits
        if (edited === '') {
            let originalContent = document.querySelector(`#post-content-${post.id}`).innerText;
            // If field is empty, set it to what the user has posted initially.
            fetch(request, {
                method: 'PUT',
                mode: 'same-origin',
                body: JSON.stringify({
                    post: originalContent
                })
            })
            .then(() => {
                document.querySelector(`#post-content-${post.id}`).innerHTML = originalContent;
                document.querySelector(`#btn-close-edit-${post.id}`).click();
            })
        }
        else {
            // Then, take the edit field and post the data
            fetch(request, {
                method: 'PUT',
                mode: 'same-origin',
                body: JSON.stringify({
                    editor: document.querySelector('strong').innerText,
                    op: document.querySelector(`#post-original-poster-${post.id}`).innerText,
                    post: document.querySelector(`#edit-field-${post.id}`).value
                })
            })
            .then(() => {
                document.querySelector(`#post-content-${post.id}`).innerHTML = document.querySelector(`#edit-field-${post.id}`).value;
                document.querySelector(`#btn-close-edit-${post.id}`).click();
            })
        }
    })
}

function follow(data, username) {
    
    // PUT data (user1_following)
    let request_user1 = new Request(
        `/profiles/${document.querySelector('strong').innerText}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    
    // Update following list of user1
    data[0].following.push(username);
    
    // PUT request on user1
    let f1 = fetch(request_user1, {
        method: 'PUT',
        mode: 'same-origin',
        body: JSON.stringify({
            following: data[0].following,
            following_count: data[0].following.length
        })
    })
    
    // PUT data (user2_followers)
    let request_user2 = new Request(
        `/profiles/${username}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    
    // Update followers of user2
    data[1].followers.push(document.querySelector('strong').innerText);
    
    // PUT request on user2
    let f2 = fetch(request_user2, {
        method: 'PUT',
        mode: 'same-origin',
        body: JSON.stringify({
            followers: data[1].followers,
            follower_count: data[1].followers.length
        })
    })

    Promise.all([f1, f2]).then(() => {
        let currentFollowerCount = document.querySelector('#title-content-followers').innerText;
        let newFollowerCount = Number(currentFollowerCount) + 1;
        document.querySelector('#title-content-followers').innerHTML = newFollowerCount;

        document.querySelector('#follow-div').innerHTML = `<button type="button" id="following-button" class="btn btn-outline-primary">Following</button>`;
        document.querySelector('#following-button').addEventListener('click', () => unfollow(data, username));
    })
}

function unfollow(data, username) {

    // Remove following of user1 in 'following'
    for (let i = 0; i < data[0].following.length; i++) {
        if (data[0].following[i] === username) {
            data[0].following.splice(i, 1);
            break;
        }
    }

    // Update followers of user2, removing user1's name
    for (let i = 0; i < data[1].followers.length; i++) {
        if (data[1].followers[i] == document.querySelector('strong').innerText) {
            data[1].followers.splice(i, 1);
            break;
        }
    }

    // PUT data (user1_following)
    let request_user1 = new Request(
        `/profiles/${document.querySelector('strong').innerText}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );
    
    // PUT request on user1
    let uf1 = fetch(request_user1, {
        method: 'PUT',
        mode: 'same-origin',
        body: JSON.stringify({
            following: data[0].following,
            following_count: data[0].following.length
        })
    })
    
    // PUT data (user2_followers)
    let request_user2 = new Request(
        `/profiles/${username}`,
        {headers: {'X-CSRFToken': csrftoken}}
    );

    // PUT request on user2
    let uf2 = fetch(request_user2, {
        method: 'PUT',
        mode: 'same-origin',
        body: JSON.stringify({
            followers: data[1].followers,
            follower_count: data[1].followers.length
        })
    })

    Promise.all([uf1, uf2]).then(() => {
        let currentFollowerCount = document.querySelector('#title-content-followers').innerText;
        let newFollowerCount = Number(currentFollowerCount) - 1;
        document.querySelector('#title-content-followers').innerHTML = newFollowerCount;

        document.querySelector('#follow-div').innerHTML = `<button type="button" id="follow-button" class="btn btn-primary">Follow</button>`;
        document.querySelector('#follow-button').addEventListener('click', () => follow(data, username));
    })
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