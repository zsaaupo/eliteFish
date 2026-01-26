from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):

    class Meta:

        model = Product
        fields = ["name", "selling_price", "buying_price", "quantity", "category", "source", "description", "created_by", "modified_by", "created_at", "modified_at"]