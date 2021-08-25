from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.db.models.fields import DateField
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from . import registrationform

from .models import User, Post, Comment
from datetime import date, datetime

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
        form = registrationform
        return render(request, "network/register.html", {
            'form': form
        })

def like(request):
    pass
        
def dislike(request):
    #TODO
    pass

def comment(request):
    #TODO
    pass

def post(request):
    if request.method == "POST":
        try:
            # Get post information
            postText = request.POST["textfield"]
            # Get current date and time
            dateStamp = date.today()
            timeStamp = datetime.now().time()
            # Save post data into the database
            post = Post(user=request.user, originalPoster=request.user, post=postText, date=dateStamp, time=timeStamp)
            post.save()
        except:
            return HttpResponse("Error. Did not manage to make post.")

    elif request.method == "GET":
        try:
            allPosts = Post.objects.all()
            postlist = [l.serialize() for l in allPosts]
            return JsonResponse(postlist, safe=False)
        except:
            return HttpResponse("Error. Did not manage to retrive necessary information.")

    return HttpResponseRedirect(reverse("index"))

def getPostbyId(request, id):
    try:
        getPost = Post.objects.get(id=id)
    except Post.DoesNotExist:
        return HttpResponse("Post does not exist")
    return JsonResponse(getPost.serialize())

def getPostsbyUser(request, username):
    try:
        allPosts = Post.objects.all()
        postslist = [l.serialize() for l in allPosts if l.originalPoster.username == username]
    except Post.DoesNotExist:
        return HttpResponse("An error occured")
    return JsonResponse(postslist, safe=False)