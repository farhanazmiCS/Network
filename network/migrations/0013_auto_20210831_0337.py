# Generated by Django 3.2.4 on 2021-08-31 03:37

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        ('network', '0012_auto_20210831_0316'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='date',
        ),
        migrations.RemoveField(
            model_name='post',
            name='time',
        ),
        migrations.AddField(
            model_name='post',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, null=True),
            preserve_default=False,
        ),
    ]
