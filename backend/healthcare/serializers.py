from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'email'

    def validate(self, attrs):
        credentials = {
            'email': attrs.get('email'),
            'password': attrs.get('password'),
        }
        user = self.user_authentication(credentials)
        if user is None:
            raise serializers.ValidationError('Invalid email or password')

        data = super().validate(attrs)
        return data

    def user_authentication(self, credentials):
        from django.contrib.auth import authenticate
        return authenticate(**credentials)
    
    