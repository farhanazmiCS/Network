
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Route
    path("posts", views.post, name="submit"),
    # Search post based on id of post
    path("posts/<int:id>", views.getPostbyId, name="getPostbyId"),
    # Search post based on users
    path("posts/<str:username>", views.getPostsbyUser, name="getPostbyUser")
]
