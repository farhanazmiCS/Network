import json, requests
from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.db.models.fields import DateField
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.http.response import HttpResponseForbidden, HttpResponseNotFound
from django.shortcuts import render
from django.urls import reverse
from django.core.paginator import Paginator

from . import registrationform

from .models import User, Post, Comment
from datetime import date, datetime

def index(request):
    fetch = requests.get('http://127.0.0.1:10000/allposts')
    posts = fetch.content
    # Decodes the JSON (Works on list of json objects too!)
    json_data = json.loads(posts)
    # Takes json_data and separates them to pages of 5
    p = Paginator(json_data, 10)
    # Gets the page number from the url. If user inputs a page that doesn't exist, set to 1.
    page_number = request.GET.get('page', 1)
    page_number_before = int(page_number) - 1
    page_number_after = int(page_number) + 1
    last_page = p.num_pages
    # Load content of the requested page
    current_page = p.page(page_number)
    return render(request, 'network/index.html', {
        'page': current_page,
        'page_num': page_number,
        'page_num_before': page_number_before,
        'page_num_after': page_number_after,
        'last_page': last_page
    })

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
    return HttpResponseRedirect(reverse("login"))


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
    #TODO
    pass

def comment(request):
    #TODO
    pass

def post(request):
    if request.method == "GET":
        try:
            # Retrieve all posts, order by date and time in descending order
            allPosts = Post.objects.all().order_by("-date", "-time")
        except Post.DoesNotExist:
            return HttpResponse("Error. Did not manage to retrive necessary information.")
        return JsonResponse([objects.serialize() for objects in allPosts], safe=False)
    elif request.method == "POST":
        try:
            # Get post information
            postText = request.POST["textfield"]
            # Get current date and time
            dateStamp = date.today()
            timeStamp = datetime.now().time().replace(microsecond=0)
            # Save post data into the database
            Post(user=request.user, originalPoster=request.user, post=postText, date=dateStamp, time=timeStamp).save()
        except:
            return HttpResponseNotFound("Error. Did not manage to make post.")
        return HttpResponseRedirect(reverse('index'))