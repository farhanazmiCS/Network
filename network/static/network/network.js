document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#all-posts').addEventListener('click', () => newsfeedAll());

    // Load feed as default
    newsfeedAll();
});

function newsfeedAll() {
    fetchAllPosts();
    // Hide and show the appropriate views
    document.querySelector('#newsfeed-all').style.display = 'block';
    document.querySelector('#newsfeed-following').style.display = 'none';
}

function fetchAllPosts() {
    fetch('/posts')
    .then(response => response.json())
    .then(post => {
        post.forEach(posts)
    });

    function posts(each) {
        // Append all items into this div
        let div = document.createElement('div');
        
        // Define elements
        let hPoster = document.createElement('h5');
        let hFeedpost = document.createElement('p');

        // Define innerHTML of elements
        let poster = document.createTextNode(`${each.poster}`);
        let feedpost = document.createTextNode(`${each.post}`);

        // Append innerHTML into elements
        hPoster.appendChild(poster);
        hFeedpost.appendChild(feedpost);

        // Append elements into div
        div.appendChild(hPoster);
        div.appendChild(hFeedpost);

        // Append div into postsAll
        document.querySelector('#postsAll').appendChild(div);
    }
}

function newsfeedFollowing() {
    // TODO
}

function fetchFollowingPosts() {
    // TODO
}

function getProfile() {
    // TODO
}