from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    follower = models.ManyToManyField('User', related_name='followings', null=True)
    following = models.ManyToManyField('User', related_name='followers', null=True)
    follower_count = models.IntegerField(default=0)
    following_count = models.IntegerField(default=0)

    def serialize(self):
        return {
            "username": self.username,
            "followers": [follower.username for follower in self.followers.all()],
            "following": [following.username for following in self.following.all()],
            "follower_count": len(self.followers.all()),
            "following_count": len(self.following.all()),
        }

class Post(models.Model):
    originalPoster = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
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
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
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