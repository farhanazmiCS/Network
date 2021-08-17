from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse

from .models import User, Post, Comment

def index(request):
    return render(request, "network/index.html")

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

def post(request):
    if request.method == "POST":
        try:
            # Get post information
            postText = request.POST["textfield"]
            # Save post data into the database
            post = Post(user=request.user, originalPoster=request.user, post=postText)
            post.save()
        except:
            return HttpResponse("Error. Something wrong happened.")
    elif request.method == "GET":
        try:
            allPosts = Post.objects.filter()
            postlist = []
            for l in allPosts:
                post_element = l.serialize()
                postlist.append(post_element)
            return JsonResponse(postlist, safe=False)
        except:
            return HttpResponse("Error. Did not manage to retrive necessary information.")
    return HttpResponseRedirect(reverse("index"))

def like(request):
    pass
        
def dislike(request):
    #TODO
    pass

def comment(request):
    #TODO
    pass

def getPost(request, id):
    if request.method == "GET":
        try:
            getPost = Post.objects.get(id=id)
        except Post.DoesNotExist:
            return HttpResponse("Post does not exist")
        return JsonResponse(getPost.serialize())
        