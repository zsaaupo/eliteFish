from django.db import models

class Audit(models.Model):
    created_by = models.CharField(max_length=100)
    modified_by = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True