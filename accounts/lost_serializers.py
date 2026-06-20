from rest_framework import serializers
from .models import LostItem


class LostItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = LostItem
        fields = '__all__'
        read_only_fields = ['user']