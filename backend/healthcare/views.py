from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import CustomTokenObtainPairSerializer
from django.contrib.auth import user_logged_in
from django.core.mail import send_mail
from django.utils import timezone
from datetime import datetime, timezone  # Import timezone from datetime

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.user
        if not user.is_staff:
            return Response({"error": "Only admin users can log in"}, status=status.HTTP_403_FORBIDDEN)
        response = super().post(request, *args, **kwargs)

        # Trigger login notification
        ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
        timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S %Z')  # Fixed: Use datetime.timezone.utc
        subject = 'Account Login Notification'
        message = f"""
        Dear {user.get_full_name() or user.username},

        Your admin account was logged in with the following details:
        - Email: {user.email}
        - IP Address: {ip_address}
        - Timestamp: {timestamp}

        If this was not you, please contact support immediately.

        Regards,
        Healthcare System
        """
        try:
            send_mail(
                subject,
                message,
                'no-reply@healthcare.local',
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Email sending failed: {e}")

        user_logged_in.send(sender=user.__class__, request=request, user=user)
        return response

class AdminLoginView(CustomTokenObtainPairView):
    pass

class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)