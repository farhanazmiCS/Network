from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    # Refer to: https://stackoverflow.com/questions/2642613/what-is-related-name-used-for-in-django for details on related_name.
    followers = models.ManyToManyField("User", related_name="fs")
    following = models.ManyToManyField("User", related_name="fg")

class Post(models.Model):
    originalPoster = models.ForeignKey("User", on_delete=models.CASCADE)
    post = models.TextField()
    likes = models.ManyToManyField("User", related_name="l")
    dislikes = models.ManyToManyField("User", related_name="dl")
    totalLikes = models.IntegerField()
    totalDislikes = models.IntegerField()

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.originalPoster,
            "post": self.post,
            "likes": self.likes,
            "dislikes": self.dislikes
        }

class Comment(models.Model):
    commenter = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)