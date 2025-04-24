from django.contrib import admin
from .models import Client, Enrollment

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

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('enrollment_id', 'client', 'program', 'enrolled_at')
    search_fields = ('enrollment_id', 'client__first_name', 'client__last_name', 'program__name')
    list_filter = ('program', 'enrolled_at')
    raw_id_fields = ('client', 'program')
    readonly_fields = ('enrollment_id', 'enrolled_at')