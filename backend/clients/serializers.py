from rest_framework import serializers
from .models import Client, Enrollment
from programs.models import Program

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id', 'first_name', 'last_name', 'age', 'phone_number',
            'area_of_residence', 'profession', 'created_at', 'updated_at'
        ]

class EnrollmentSerializer(serializers.ModelSerializer):
    client_id = serializers.PrimaryKeyRelatedField(
        queryset=Client.objects.all(), source='client'
    )
    program_id = serializers.PrimaryKeyRelatedField(
        queryset=Program.objects.all(), source='program'
    )

    class Meta:
        model = Enrollment
        fields = ['id', 'client_id', 'program_id', 'enrollment_id', 'enrolled_at']
        read_only_fields = ['enrollment_id', 'enrolled_at']