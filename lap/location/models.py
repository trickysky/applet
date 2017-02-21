from __future__ import unicode_literals

from django.db import models


# Create your models here.
class Data(models.Model):
    user_id = models.CharField(max_length=255)
    datetime = models.DateTimeField()
    longitude = models.FloatField()
    latitude = models.FloatField()
