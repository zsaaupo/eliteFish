from django.db import models

# Create your models here.

class Product(models.Model):

    name = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField()
    category = models.IntegerField(choices=((0, 'River fish'),(1, 'Sea fish')))
    source = models.CharField(max_length=50)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return self.name + " (" + str(self.quantity) + ")"
