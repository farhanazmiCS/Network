from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass

class Post(models.Model):
    originalPoster = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.TextField()
    likes = models.IntegerField()
    dislikes = models.IntegerField()

class Like(models.Model):
    liker = models.ForeignKey(User, on_delete=models.CASCADE)

class Dislike(models.Model):
    disliker = models.ForeignKey(User, on_delete=models.CASCADE)

class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)