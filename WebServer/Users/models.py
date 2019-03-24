from django.db import models
from django.utils import timezone

# Create your models here.
def getWidgets():
    widgets= []
    with open("/home/ryan/Documents/webserver/Users/apps.txt", "r") as f:
        lines = f.readlines()
    for widget in lines:
        widgets.append((widget[:-3],widget))
    return widgets

available_widgets = getWidgets()

class User(models.Model):
    username=models.CharField(max_length=20)
    added_date = models.DateTimeField('Date Added', default = timezone.now)
    def __str__(self):
        return self.username
    def get_absolute_url(self):
        return u'/Users/'


class Widget(models.Model):
    appname=models.CharField(max_length=20)
    user=models.ForeignKey(User,on_delete=models.CASCADE,default=None)
    added_date=models.DateTimeField('Date Added', default = timezone.now)
    creator=models.CharField(max_length=20, default = "Unknown")
    def __str__(self):
        return self.appname
    def get_absolute_url(self):
        return u'/Users/'


