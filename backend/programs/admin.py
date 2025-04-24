from django.contrib import admin
from .models import Program

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'short_code', 'description', 'created_at')
    search_fields = ('name', 'short_code')
    list_filter = ('created_at',)
    ordering = ('name',)
    fieldsets = (
        (None, {
            'fields': ('name', 'short_code', 'description')
        }),
    )