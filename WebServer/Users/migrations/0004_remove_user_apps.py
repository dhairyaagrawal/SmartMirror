# Generated by Django 2.1.5 on 2019-02-19 17:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0003_widget_user'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='user',
            name='apps',
        ),
    ]
