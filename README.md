# HealthConnect

A comprehensive healthcare management system that helps doctors create health programs, manage clients, and analyze healthcare data effectively.

![HealthConnect Dashboard](/frontend/frontend/public/assets/images/analytics.png)

### Demo video

[Watch on YouTube](https://youtu.be/mEiXFp0eBFg?si=Z-0uBVEB1VwztFlL)

### youtube link 👇

https://youtu.be/mEiXFp0eBFg?si=Z-0uBVEB1VwztFlL



### powerpoint link 👇
[Powerpoint Presentation ](https://docs.google.com/presentation/d/1ggoKZxfkphdQfY-1fUcAB4cq6Xwo8b02/edit?usp=sharing&ouid=100736522624546505150&rtpof=true&sd=true)

https://docs.google.com/presentation/d/1ggoKZxfkphdQfY-1fUcAB4cq6Xwo8b02/edit?usp=sharing&ouid=100736522624546505150&rtpof=true&sd=true

## Overview

HealthConnect is a user-friendly platform designed specifically for healthcare providers. With an intuitive NextJS frontend and powerful Django backend, this system allows doctors to create custom health programs, securely manage client information, and gain valuable insights through data analytics. The system uses a fully API-based approach, ensuring secure data transmission between the frontend and backend components.

## Key Features

### Program Management
- Admin creates health programs with detailed descriptions and assigns unique short codes
- Organize and manage all your healthcare programs in one place
- Access programs quickly using their short code identifiers

### Client Management
- Register new clients securely through our API
- Store client information with proper security measures
- Enroll clients in health programs with unique enrollment IDs based on program short codes
- Track client progress through various programs

![Client Management Interface](/frontend/frontend/public/assets/images/client.png)

### Security
- Automated email notifications for login activities to detect suspicious access
- Secure authentication through Django REST Framework
- Data encryption for sensitive client information
- All data transmitted securely through encrypted channels

![Security email](/frontend/frontend/public/assets/images/email.png)
Client Management Interface
### Analytics Dashboard
- View comprehensive client demographics
- Track client growth metrics
- Analyze professional distribution data
- Visualize age distribution through interactive charts
- Make data-driven decisions to improve healthcare delivery

![Analytics Dashboard](/frontend/frontend/public/assets/images/analytics.png)

## Technical Details

### Frontend
- Built with React for a responsive and dynamic user interface
- Interactive data visualization components
- User-friendly design for healthcare professionals

![Program Creation Interface]

![Client Management Interface](/frontend/frontend/public/assets/images/programm.png)

### Backend
- Django framework for robust application structure
- REST API endpoints for secure data access
- Authentication and authorization systems
- Fully API-based approach for all operations

## API Documentation

Our system provides a complete REST API with the following endpoints:

- **Authentication**: 
  - `/api/admin/login` - Admin authentication
  - `/api/admin/logout` - End user session

- **Programs**: 
  - `/api/programs` 
    - Create, view, update, and delete health programs
    - Operations on specific programs

- **Clients**: 
  - `/api/clients` 
    - Register clients and manage their information
    - Operations on specific clients

- **Enrollments**: 
  - `/api/enrollments` 
    - Enroll clients in programs
     - Manage specific enrollments

- **Analytics**: 
  - `/api/analytics` 
    - Access data insights and statistical information
     - Client demographic data
    - Practice growth metrics

Access our Swagger documentation at `/api/docs/` after installation for interactive testing and detailed API specifications.

![API Documentation](/frontend/frontend/public/assets/images/api.png))

## Getting Started

1. Clone the repository:
```
git clone https://github.com/Ndegwadavid/CEMA-Health.git
cd CEMA-Health
```

2. Set up the backend:
```
cd backend
python -m venv env
source env/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

3. Set up the frontend:
```
cd ../frontend
npm install
npm start
```

4. Setup the mailpit server

```
on terminal run 👇
./mailpit
{if installed}
If not instructions to install found online.
```
## Install mailpit
https://mailpit.axllent.org/docs/install/

Visit `http://localhost:3000` to access the application.

## Enrollment ID System

The system generates unique enrollment IDs for clients based on the short code of the program they're enrolled in. For example:

- Program with short code "HIV" would generate enrollment IDs like: 
HIV/2025/W4CMaCid,
- Program with short code "BTN" would generate enrollment IDs like: 
BTN/2025/W4CMaCid

This allows for easy identification of which program a client is enrolled in just by looking at their enrollment ID.

## Security Considerations

HealthConnect prioritizes data security and patient privacy:
- All API requests require authentication
- Sensitive data is encrypted at rest and in transit
- Login activity monitoring with email notifications
- Compliance with healthcare data protection standards
- Secure API-based data transmission

## Contact

For questions or support, please open an issue on our [GitHub repository](https://github.com/Ndegwadavid/CEMA-Health).

## License

[MIT License](LICENSE)