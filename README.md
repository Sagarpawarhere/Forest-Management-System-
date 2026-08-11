# Forest Management System

A web application for managing forest resources, patrol logs, incidents, and species. Built with Node.js, Express, MongoDB, and React.

## Features
- Dashboard with quick stats
- Left navigation bar (blue/white theme)
- Map view with fire alerts
- Species master (CRUD)
- Patrol logs (ranger/admin roles, CRUD)
- Incident management (CRUD)
- Reports (summary, trends)
- Authentication (admin/ranger, JWT)
- Role-based access control

## Folder Structure
```
backend/
  controllers/
  middleware/
  models/
  routes/
  server.js
frontend/
  components/
  public/
  src/
    components/
    pages/
    services/
    App.js
```

## Setup Instructions
### Backend
1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start MongoDB locally (default URI: mongodb://127.0.0.1:27017/forestDB)
3. Start server:
   ```bash
   npm run dev
   ```

### Frontend
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start frontend:
   ```bash
   npm run dev
   ```

## API Endpoints
- `/api/auth/register` (POST): Register user
- `/api/auth/login` (POST): Login user
- `/api/species` (CRUD): Manage species
- `/api/incidents` (CRUD): Manage incidents
- `/api/patrol-logs` (CRUD): Manage patrol logs (admin/ranger access)

## Authentication
- JWT-based
- Admin: Full access
- Ranger: Own logs, view species/incidents

## Database Models
- User: name, email, password, role
- Species: name, category, population, status
- Incident: type, description, severity, location
- PatrolLog: ranger, date, start/end lat/long, notes

## Customization
- Blue/white theme
- Responsive design
- Add more modules as needed

## Optional Features
- Email notifications (priority 2)
- Export reports (PDF/CSV, priority 2)

## License
MIT
