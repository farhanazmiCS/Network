# Generated by Django 3.2.4 on 2021-09-02 07:51

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0022_alter_post_likedby'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='likedBy',
        ),
        migrations.AddField(
            model_name='post',
            name='likedBy',
            field=models.ManyToManyField(related_name='likers', to=settings.AUTH_USER_MODEL),
        ),
    ]
