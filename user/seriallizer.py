from rest_framework import serializers
from .models import FisherMan

class FisherManSerializer(serializers.ModelSerializer):
    active = serializers.SerializerMethodField()

    class Meta:
        model = FisherMan
        fields = ["name", "email", "phone", "designation", "active"]

    def get_active(self, obj):
        # Map directly from the related User model
        return obj.user.is_active
