
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("allposts", views.post, name="allPosts"),
    path("allposts/<int:id>", views.postId, name="postbyId"),
    path("allposts/<str:following>", views.placeholder, name="postsByFollowing"),
    path("likes/<int:post_id>", views.like, name="like"),
    path("comments/<int:post_id>", views.comment, name="comment")
]
