from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Every profile will have a many-to-many relationship with many other profiles
    followers = models.ManyToManyField('User', related_name="fs")
    following = models.ManyToManyField('User', related_name="fg")
    profilePic = models.ImageField(blank=True)

class Post(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="userpost")
    originalPoster = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.TextField()
    likes = models.ManyToManyField(User, blank=True, related_name="l")
    dislikes = models.ManyToManyField(User, blank=True, related_name="dl")
    totalLikes = models.IntegerField(default=0)
    totalDislikes = models.IntegerField(default=0)
    date = models.DateField(blank=True, null=True)
    time = models.TimeField(blank=True, null=True)

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.originalPoster.username,
            "post": self.post,
            "totalLikes": self.totalLikes,
            "totalDislikes": self.totalDislikes,
            "likes": [user.likes for user in self.likes.all()],
            "dislikes": [user.likes for user in self.likes.all()],
            "timestamp": f"Posted on {self.date} at {self.time}"
        }

class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)