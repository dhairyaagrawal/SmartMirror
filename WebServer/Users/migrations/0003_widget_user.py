# Generated by Django 2.1.5 on 2019-02-18 23:34

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('Users', '0002_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='widget',
            name='user',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='Users.User'),
        ),
    ]
