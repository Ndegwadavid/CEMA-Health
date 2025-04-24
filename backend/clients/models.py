from django.db import models
from django.core.validators import RegexValidator, MinValueValidator, MaxValueValidator

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