from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClientViewSet, EnrollmentViewSet

router = DefaultRouter()
router.register(r'clients', ClientViewSet)
router.register(r'enrollments', EnrollmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]