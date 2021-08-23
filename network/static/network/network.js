document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#all-posts').addEventListener('click', () => newsfeed());

    // Load feed as default
    newsfeed();
});

function newsfeed() {
    fetch('/posts')
    .then(response => response.json())
    .then(post => {
        post.forEach(loopelement)
    });
    document.querySelector('#make-new-post').style.display = 'block';
}

function loopelement(eachpost) {
    // Append all items into this div
    let div = document.createElement('div');
    let hPoster = document.createElement('h5');
    let hFeedpost = document.createElement('p');
    let poster = document.createTextNode(`${eachpost.poster}`);
    let feedpost = document.createTextNode(`${eachpost.post}`);
    hPoster.appendChild(poster);
    hFeedpost.appendChild(feedpost);
    div.appendChild(hPoster);
    div.appendChild(hFeedpost);
}

function getProfile() {
    // TODO
}