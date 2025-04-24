import random
import string
from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator
from django.utils import timezone
from programs.models import Program

class Client(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    age = models.PositiveIntegerField(
        validators=[
            MinValueValidator(0),
            MaxValueValidator(150)
        ]
    )
    phone_number = models.CharField(
        max_length=15,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number (e.g., +1234567890).')]
    )
    area_of_residence = models.CharField(max_length=100)
    profession = models.CharField(max_length=100, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

    class Meta:
        ordering = ['last_name', 'first_name']

class Enrollment(models.Model):
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='enrollments')
    program = models.ForeignKey(Program, on_delete=models.CASCADE, related_name='enrollments')
    enrollment_id = models.CharField(max_length=50, unique=True, editable=False)
    enrolled_at = models.DateTimeField(auto_now_add=True)

    def generate_enrollment_id(self):
        year = timezone.now().year
        random_chars = ''.join(random.choices(string.ascii_letters + string.digits, k=8))
        return f"{self.program.short_code}/{year}/{random_chars}"

    def save(self, *args, **kwargs):
        if not self.enrollment_id:
            self.enrollment_id = self.generate_enrollment_id()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.client} in {self.program} ({self.enrollment_id})"

    class Meta:
        unique_together = ('client', 'program')
        ordering = ['enrolled_at']