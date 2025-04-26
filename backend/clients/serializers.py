# backend/clients/serializers.py
from rest_framework import serializers
from .models import Client, Enrollment
from programs.models import Program

class EnrollmentSerializer(serializers.ModelSerializer):
    program_name = serializers.CharField(source='program.name', read_only=True)
    program_short_code = serializers.CharField(source='program.short_code', read_only=True)

    class Meta:
        model = Enrollment
        fields = ['id', 'client_id', 'program_id', 'program_name', 'program_short_code', 'enrollment_id', 'enrolled_at']
        read_only_fields = ['id', 'enrollment_id', 'enrolled_at']

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
    client_id = serializers.IntegerField()
    program_id = serializers.IntegerField()

    class Meta:
        model = Enrollment
        fields = ['id', 'client_id', 'program_id', 'enrollment_id', 'enrolled_at']
        read_only_fields = ['id', 'enrollment_id', 'enrolled_at']

    def validate(self, data):
        # Ensure client and program exist
        try:
            client = Client.objects.get(id=data['client_id'])
        except Client.DoesNotExist:
            raise serializers.ValidationError({"client_id": "Client does not exist"})
        
        try:
            program = Program.objects.get(id=data['program_id'])
        except Program.DoesNotExist:
            raise serializers.ValidationError({"program_id": "Program does not exist"})

        # Check for duplicate enrollment
        if Enrollment.objects.filter(client=client, program=program).exists():
            raise serializers.ValidationError({"non_field_errors": "Client is already enrolled in this program"})

        # Set client and program on the instance
        data['client'] = client
        data['program'] = program
        return data