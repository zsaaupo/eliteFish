from django.db import models

class Audit(models.Model):
    created_by = models.CharField(max_length=100)
    modified_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Sell(Audit):
    invoice_no = models.AutoField(primary_key=True)
    customer_name = models.CharField(max_length=100)
    customer_phone = models.CharField(max_length=11, null=True, blank=True)
    customer_address = models.TextField(null=True, blank=True)
    seller = models.CharField(max_length=100)
    product = models.CharField(max_length=100)
    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)


class Buy(Audit):
    invoice_no = models.AutoField(primary_key=True)
    supplier_name = models.CharField(max_length=100)
    supplier_phone = models.CharField(max_length=11, null=True, blank=True)
    supplier_address = models.TextField(null=True, blank=True)
    buying_manager = models.CharField(max_length=100)
    product = models.CharField(max_length=100)
    quantity = models.IntegerField()
    buying_price = models.DecimalField(max_digits=10, decimal_places=2)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)

class Activity(models.Model):
    user_name = models.CharField(max_length=100)
    time = models.DateTimeField(auto_now_add=True)
    is_login = models.BooleanField(default=True)

    def __str__(self):
        return self.user_name + " - " + self.time.strftime("%I:%M:%S %p, %d-%m-%Y")