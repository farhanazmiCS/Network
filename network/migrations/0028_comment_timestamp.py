# Generated by Django 3.2.4 on 2021-09-10 03:53

import datetime
from django.db import migrations, models
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('network', '0027_auto_20210903_0304'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='timestamp',
            field=models.DateTimeField(auto_now_add=True, default=datetime.datetime(2021, 9, 10, 3, 53, 4, 80132, tzinfo=utc)),
            preserve_default=False,
        ),
    ]
