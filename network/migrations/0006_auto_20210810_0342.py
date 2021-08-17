# Generated by Django 3.2.4 on 2021-08-10 03:42

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0005_auto_20210810_0325'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='like',
            name='liker',
        ),
        migrations.AddField(
            model_name='post',
            name='totalDislikes',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='post',
            name='totalLikes',
            field=models.IntegerField(default=0),
            preserve_default=False,
        ),
        migrations.RemoveField(
            model_name='post',
            name='dislikes',
        ),
        migrations.AddField(
            model_name='post',
            name='dislikes',
            field=models.ManyToManyField(related_name='dl', to=settings.AUTH_USER_MODEL),
        ),
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(related_name='l', to=settings.AUTH_USER_MODEL),
        ),
        migrations.DeleteModel(
            name='Dislike',
        ),
        migrations.DeleteModel(
            name='Like',
        ),
    ]