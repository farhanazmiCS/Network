document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#all-posts').addEventListener('click', loadAll);
    document.querySelector(`#like-${id}`).addEventListener('click', likePost(id))
    
    // By default load all posts
    loadAll()
})

function loadAll() {
    document.querySelector('#newsfeed-all').style.display = 'block';
    document.querySelector('#newsfeed-following').style.display = 'none';
}

function likePost(id) {
    fetch(`/allposts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            isLiked: true
        })
    })  
}