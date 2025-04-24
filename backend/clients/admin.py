from django.contrib import admin
from .models import Client

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'age', 'phone_number', 'area_of_residence', 'profession', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone_number')
    list_filter = ('area_of_residence', 'created_at')
    ordering = ('last_name', 'first_name')
    fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'age', 'phone_number', 'area_of_residence', 'profession')
        }),
    )