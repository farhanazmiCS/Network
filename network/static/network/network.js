document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('strong').addEventListener('onclick', () => getProfile());
    document.querySelector('#all-posts').addEventListener('onclick', () => feed());

    // Load feed as default
    feed();
})