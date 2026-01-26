from django.db import models
from record.models import Audit

# Create your models here.

class Product(Audit):

    name = models.CharField(max_length=50, primary_key=True)
    selling_price = models.DecimalField(max_digits=10, decimal_places=2)
    buying_price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(null=True, blank=True)
    category = models.IntegerField(choices=((0, 'River fish'),(1, 'Sea fish')))
    source = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name + " (" + str(self.quantity) + ")"
