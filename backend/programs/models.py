from django.db import models
from django.core.validators import RegexValidator

class Program(models.Model):
    name = models.CharField(max_length=100, unique=True)
    short_code = models.CharField(
        max_length=10,
        unique=True,
        validators=[RegexValidator(r'^[A-Z0-9]+$', 'Only uppercase letters and numbers are allowed.')]
    )
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name