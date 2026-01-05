from django.contrib.auth.models import User
from django.db import models

# Create your models here.

class FisherMan(models.Model):

    user = models.OneToOneField(User, on_delete=models.PROTECT)
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50)
    email = models.EmailField(max_length=200)
    phone = models.CharField(max_length=11)
    designation = models.IntegerField(choices=((0, 'Business Owner'),(1, 'Storage manager'),(2, 'Sales man')))

    def save(self, *args, **kwargs):
        if not self.id:
            last_id = User.objects.order_by('-id').first()
            self.id = 1000 if not last_id else last_id.id + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name