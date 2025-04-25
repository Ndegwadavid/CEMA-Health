##from django.contrib.auth.signals import user_logged_in
##from django.dispatch import receiver
##from django.core.mail import send_mail
##from django.utils import timezone
##from datetime import datetime
##
##@receiver(user_logged_in)
##def send_login_notification(sender, user, request, **kwargs):
##    ip_address = request.META.get('REMOTE_ADDR', 'Unknown')
##    timestamp = datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S %Z')
##    subject = 'Login Notification'
##    message = f"""
##    Dear {user.get_full_name() or user.username},
##
##    Your account was logged in with the following details:
##    - Email: {user.email}
##    - IP Address: {ip_address}
##    - Timestamp: {timestamp}
##
##    If this was not you, please contact support immediately.
##
##    Regards,
##    Healthcare System
##    """
##    send_mail(
##        subject,
##        message,
##        'no-reply@healthcare.local',
##        [user.email],
##        fail_silently=False,
##    )