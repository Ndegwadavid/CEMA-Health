from rest_framework import serializers
from .models import Client, Enrollment
from programs.models import Program

class EnrollmentSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name', read_only=True)
    program_short_code = serializers.CharField(source='program.short_code', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'program_id', 'program_name', 'program_short_code', 'enrollment_id', 'enrolled_at']
        read_only_fields = ['enrollment_id', 'enrolled_at']

class ClientSerializer(serializers.ModelSerializer):
    enrollments = EnrollmentSerializer(many=True, read_only=True)

    class Meta:
        model = Client
        fields = [
            'id', 'first_name', 'last_name', 'age', 'phone_number',
            'area_of_residence', 'profession', 'created_at', 'updated_at',
            'enrollments'
        ]

class ClientCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = [
            'id', 'first_name', 'last_name', 'age', 'phone_number',
            'area_of_residence', 'profession'
        ]

class EnrollmentCreateSerializer(serializers.ModelSerializer):
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