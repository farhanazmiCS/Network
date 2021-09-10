from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Every profile will have a many-to-many relationship with many other profiles
    followers = models.ManyToManyField('User', related_name="fs")
    following = models.ManyToManyField('User', related_name="fg")
    profilePic = models.ImageField(blank=True)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="loggedUser")
    originalPoster = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "op": self.originalPoster.username,
            "post": self.post,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="commenter")
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    comment = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "commenter": self.commenter.username,
            "post": self.post_id,
            "comment": self.comment,
            "timestamp":  self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

class Like(models.Model):
    liker = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "liker": self.liker.username,
            "post": self.post_id,
            "timestamp":  self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }