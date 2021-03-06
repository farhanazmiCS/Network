# Generated by Django 3.2.4 on 2021-09-22 05:22

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0036_auto_20210915_0329'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='followers',
            field=models.ManyToManyField(null=True, related_name='fwng', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='user',
            name='following',
            field=models.ManyToManyField(null=True, related_name='fwrs', to=settings.AUTH_USER_MODEL),
        ),
    ]
