
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("myfeed", views.indexFollowing, name="indexFollowing"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("viewprofile/<str:username>", views.view_profile, name="view_profile"),
    path("search", views.search_user, name="search"),

    # API Routes
    # Loads all posts as JSON and to POST new posts. (GET and POST)
    path("allposts", views.post, name="allPosts"),
    # Loads a post by ID as JSON and PUT current post. (GET and PUT)
    path("post/<int:id>", views.postId, name="postbyId"),
    # Loads a post by USERNAME as JSON 
    path("posts/<str:username>", views.postUsername, name="postbyUsername"),
    # Loads all the posts of users that a user is following
    path("following", views.postFollowing, name="postsFollowing"),
    # Loads all likes for a post as JSON, POST new likes and DELETE likes (GET, POST, DELETE)
    path("likes/<int:post_id>", views.like, name="like"),
    # Loads all comments for a post as JSON and POST new comments (GET and POST)
    path("comments/<int:post_id>", views.comment, name="comment"),
    # Profile API
    path("profiles/<str:username>", views.profile, name="profile")
]   
