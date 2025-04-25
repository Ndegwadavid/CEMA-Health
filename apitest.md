## collecting token
curl -X POST http://localhost:8000/api/admin/login/ \
-H "Content-Type: application/json" \
-d '{ "username": "davidadmin", "email": "davidadmin@gmail.com", "password": "kali"}'