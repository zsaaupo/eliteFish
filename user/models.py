from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class FisherMan(models.Model):

    user = models.OneToOneField(User, on_delete=models.PROTECT)
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=200, primary_key=True)
    phone = models.CharField(max_length=11)
    designation = models.IntegerField(choices=((0, 'Business Owner'),(1, 'Storage manager'),(2, 'Sales man')))

    def __str__(self):
        return self.name