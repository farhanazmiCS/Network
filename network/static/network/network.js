document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#all-posts').addEventListener('click', loadAll);
    
    // By default load all posts
    loadAll();
})


function loadAll() {
    document.querySelector('#newsfeed-all').style.display = 'block';
    document.querySelector('#newsfeed-following').style.display = 'none';

    // Used to loop all the post and getting the like button
    fetch('/allposts')
    .then(response => response.json())
    .then(post => {
        post.forEach(eachPost)
    })
}


function eachPost(element) {
    let user = document.querySelector('strong').innerText;
    let likeButton = document.querySelector(`#like-${element.id}`);
    
    fetch(`/likes/${element.id}`)
    .then(response => response.json())
    .then(likes => {
        if (likes.some(like => like.liker == user)) {
            likeButton.style.color = '#eb4034';
            likeButton.addEventListener('click', () => unlikePost(element.id));
        }
        else {
            likeButton.style.color = '#000000';
            likeButton.addEventListener('click', () => likePost(element.id));
        }
    })


    function likePost(id) {
        fetch(`/likes/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                liker: user,
                post: id
            })
        })
        loadAll()
        console.log(user);
        console.log(id);
    }


    function unlikePost(id) {
        fetch(`/likes/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({
                liker: user,
                post: id
            })
        })
        loadAll()
        console.log(`${user}-unlike`);
        console.log(`${id}-unlike`);
    }
}