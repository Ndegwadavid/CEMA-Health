from django.contrib import admin
from .models import Client, Enrollment

@admin.register(Client)
class ClientAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'age', 'phone_number', 'area_of_residence', 'profession', 'get_enrolled_programs', 'created_at')
    search_fields = ('first_name', 'last_name', 'phone_number')
    list_filter = ('area_of_residence', 'created_at', 'enrollments__program')
    ordering = ('last_name', 'first_name')
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'age', 'phone_number')
        }),
        ('Additional Details', {
            'fields': ('area_of_residence', 'profession')
        }),
    )
    readonly_fields = ('created_at', 'updated_at')

    def get_enrolled_programs(self, obj):
        return ", ".join([f"{enrollment.program.name} ({enrollment.enrollment_id})" for enrollment in obj.enrollments.all()])
    get_enrolled_programs.short_description = 'Enrolled Programs'

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('enrollment_id', 'client', 'program', 'enrolled_at')
    search_fields = ('enrollment_id', 'client__first_name', 'client__last_name', 'program__name')
    list_filter = ('program', 'enrolled_at')
    raw_id_fields = ('client', 'program')
    readonly_fields = ('enrollment_id', 'enrolled_at')