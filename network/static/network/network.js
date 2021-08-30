document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#all-posts').addEventListener('click', loadAll);
    
    // By default load all posts
    loadAll()
})

function post() {
    document.querySelector('#submit').addEventListener('submit', () => submitPost())
}

function submitPost() {
    fetch('/allposts', {
        method: 'POST',
        body: JSON.stringify({
            op: document.querySelector('strong').innerText,
            post: document.querySelector('#text').value,
            totalLikes: 0,
            totalDislikes: 0
        })
    })
}

function loadAll() {
    document.querySelector('#newsfeed-all').style.display = 'block';
    document.querySelector('#newsfeed-following').style.display = 'none';
}

function likePost() {
    // TODO
}