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
    isLiked = models.BooleanField(default=False)
    likes = models.IntegerField(default=0)
    likedBy = models.ManyToManyField(User, related_name="likers")
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "op": self.originalPoster.username,
            "post": self.post,
            "isLiked": self.isLiked,
            "totalLikes": self.likes,
            "likedBy": [likers.user for likers in self.likedBy.all()],
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }

class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)