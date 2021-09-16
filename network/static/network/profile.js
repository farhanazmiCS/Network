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
    let username = document.querySelector('strong').innerText;
    view_profile.href = `/viewprofile/${username}`;

    // By default, load user's profile
    load_profile()
})


function load_profile() {
    // Get username
    let ref = location.href;
    let username = ref.slice(34);

    // Fetch follower / following data
    fetch(`/profiles/${username}`)
    .then(response => response.json())
    .then(profiles => {
        // Insert follower / following data
        let follower_element = document.querySelector('#title-content-followers');
        let following_element = document.querySelector('#title-content-following');
        follower_element.innerHTML = profiles.follower_count;
        following_element.innerHTML = profiles.following_count;

        // Insert username
        let username_element = document.querySelector('#username-profile-child');
        username_element.innerHTML = username;
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
}

function post(each) {
    // Create new div called 'post-element', to contain each post data
    let post_element = document.createElement('div');
    post_element.className = 'post-element';
    post_element.id = each.id;

    // Append each post_element to '#my-posts'
    let my_posts = document.querySelector('#my-posts');
    my_posts.appendChild(post_element);

    // Content of div
    post_element.innerHTML = `<h4 id="post-original-poster-${ each.id }">${ each.op }</h4>
    <p id="post-content-${ each.id }">${ each.post }</p>
    <p class="timestamp">Posted on ${ each.timestamp }</p><div class="total-likes-${ each.id }">
    <i id="like-${ each.id }" class="far fa-thumbs-up"></i> <h5 class="like-count" id="like-count-${ each.id }"></h5>
    <i id="comment-${ each.id }" class="fas fa-comment"></i> <h5 class="comment-count" id="comment-count-${ each.id }"></h5>
    <h5 id="edit-${ each.id }" class="edit" data-bs-toggle="modal" data-bs-target="#modal-edit-${ each.id }">Edit</h5>
    </div>
    <hr>`

    let body = document.querySelector('.body');
    let modal_fade = document.createElement('div');
    // Edit modal attributes
    modal_fade.className = 'modal fade';
    modal_fade.id = `modal-edit-${each.id}`;
    modal_fade.setAttribute('tabindex', '-1');
    modal_fade.setAttribute('aria-labelledby', 'exampleModalLabel');
    modal_fade.setAttribute('aria-hidden', 'true');
    // Append modal into body
    body.appendChild(modal_fade);
    

    // Modal Dialogue
    let modal_dialog = document.createElement('div');
    modal_dialog.className = 'modal-dialog modal-dialog-scrollable';
    modal_fade.appendChild(modal_dialog);

    // Modal Content
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
    
    // Comment Button
    document.querySelector(`#edit-${ each.id }`).addEventListener('click', () => editPost(each));
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
            location.reload();
        }
        else {
            // Then, take the edit field and post the data
            fetch(request, {
                method: 'PUT',
                mode: 'same-origin',
                body: JSON.stringify({
                    post: document.querySelector(`#edit-field-${post.id}`).value
                })
            })
            location.reload();
        }
    })
}