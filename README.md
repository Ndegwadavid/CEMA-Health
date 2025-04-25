# Healthcare System Backend

A Django-based backend for managing healthcare clients, programs, and enrollments. The system features JWT authentication, email notifications for login events, and a comprehensive RESTful API.

## Features

- **Client Management**: Create, update, and search clients by name or phone number
- **Program Management**: Create and manage healthcare programs
- **Enrollment**: Enroll clients in programs with unique enrollment IDs
- **Client Profile**: View client details and enrolled programs via admin panel and API
- **Authentication**: Secure email and password login with JWT tokens (1-hour expiration)
- **Security**: Login notifications with IP address and timestamp sent via email
- **API Documentation**: Interactive Swagger UI at `/swagger/`

## Requirements

- Python 3.8+
- Django 4.2.20
- Django REST Framework
- djangorestframework-simplejwt
- drf-yasg
- django-cors-headers
- Mailpit (for email testing)

## Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd backend
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install django==4.2.20 djangorestframework djangorestframework-simplejwt drf-yasg django-cors-headers
```

### 4. Apply Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Create a Superuser

```bash
python manage.py createsuperuser
```

### 6. Run Mailpit (for Email Testing)

Option 1:
```bash
mailpit
```

Option 2 (Docker):
```bash
docker run -p 8025:8025 -p 1025:1025 axllent/mailpit
```

Access Mailpit UI at http://localhost:8025 to view emails.

### 7. Run the Server

```bash
python manage.py runserver
```

## API Endpoints

### Authentication
- `POST /api/token/`: Obtain JWT tokens (email, password)
- `POST /api/admin/login/`: Admin login (email, password, requires is_staff)
- `POST /api/token/refresh/`: Refresh access token
- `POST /api/logout/`: Blacklist refresh token (requires JWT)

### Programs
- `GET/POST /api/programs/`: List or create programs
- `GET/PUT/DELETE /api/programs/{id}/`: Retrieve, update, or delete a program

### Clients
- `GET/POST /api/clients/`: List or create clients
- `GET/PUT/DELETE /api/clients/{id}/`: Retrieve, update, or delete a client
- `GET /api/clients/search/`: Search clients by name or phone number (`?q=query`)
- `GET /api/clients/{id}/profile/`: Retrieve client profile with enrollments

### Enrollments
- `GET/POST /api/enrollments/`: List or create enrollments
- `GET/PUT/DELETE /api/enrollments/{id}/`: Retrieve, update, or delete an enrollment

## Authentication Guide

Use `/api/admin/login/` or `/api/token/` to obtain JWT tokens:

```bash
curl -X POST http://localhost:8000/api/admin/login/ \
-H "Content-Type: application/json" \
-d '{"email": "admin@example.com", "password": "securepassword123"}'
```

Include the access token in subsequent requests:

```bash
curl -H "Authorization: Bearer access_token_here" \
http://localhost:8000/api/clients/
```

## Email Notifications

- Login events trigger emails with IP address and timestamp
- View emails at http://localhost:8025 (Mailpit UI)
- Ensure Mailpit is running on localhost:1025

## Admin Panel

- Access at http://localhost:8000/admin (email and password login)
- Frontend will use `:3000/admin` with `/api/admin/login/`

## Swagger Documentation

- View interactive API documentation at http://localhost:8000/swagger/

## Frontend Integration

- **CORS**: Configured for http://localhost:3000
- **Login**: Use `/api/admin/login/` to authenticate
- **API Requests**: Include JWT token in `Authorization: Bearer` header

## Troubleshooting

### Emails Not Sending
1. Check Mailpit UI (http://localhost:8025) and terminal for errors (`Email sending failed: ...`)
2. Test Mailpit:
   ```python
   python manage.py shell
   from django.core.mail import send_mail
   send_mail('Test Subject', 'Test Message', 'no-reply@healthcare.local', ['test@example.com'], fail_silently=False)
   ```

### Login Issues
- Ensure superuser has `is_staff=True` and correct email

## Production Notes

- Set `DEBUG = False`
- Enable HTTPS:
  ```python
  SECURE_SSL_REDIRECT = True
  SESSION_COOKIE_SECURE = True
  CSRF_COOKIE_SECURE = True
  ```
- Use a real SMTP server (e.g., Gmail, SendGrid) instead of Mailpit