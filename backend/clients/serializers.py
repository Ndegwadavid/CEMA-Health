from rest_framework import serializers
from .models import Client

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id', 'first_name', 'last_name', 'age', 'phone_number',
            'area_of_residence', 'profession', 'created_at', 'updated_at'
        ]