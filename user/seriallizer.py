from rest_framework import serializers
from .models import FisherMan

class FisherManSerializer(serializers.ModelSerializer):

    class Meta:

        model = FisherMan
        fields = ["name", "email", "phone", "designation"]