## collecting token
curl -X POST http://localhost:8000/api/admin/login/ \
-H "Content-Type: application/json" \
-d '{ "username": "davidadmin", "email": "davidadmin@gmail.com", "password": "kali"}'


curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1NTQ0NzY4LCJpYXQiOjE3NDU1NDExNjgsImp0aSI6IjE2N2Q2MjUwMWE0MjQ0MmJhNzk0NTk2NGNmNDExNmI0IiwidXNlcl9pZCI6MX0.W3Tj3u7_q7z0E0bCojaxS01fRH-I8KFNhJXmJxX0tDE" \
http://localhost:8000/api/clients/search/?q=David

## profile of a cleint expose via api
curl -H "Authorization: Bearer <access_token>" \
http://localhost:8000/api/clients/1/profile/


curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ1NTQ0NzY4LCJpYXQiOjE3NDU1NDExNjgsImp0aSI6IjE2N2Q2MjUwMWE0MjQ0MmJhNzk0NTk2NGNmNDExNmI0IiwidXNlcl9pZCI6MX0.W3Tj3u7_q7z0E0bCojaxS01fRH-I8KFNhJXmJxX0tDE" \
http://localhost:8000/api/clients/1/profile/