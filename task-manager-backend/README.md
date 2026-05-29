# Task Manager Backend

Node.js Express backend for the Project & Task Manager application.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the backend folder
2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your PostgreSQL database and update `.env`

5. Run database migrations:
```bash
npm run migrate
```

6. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Project Structure

```
src/
├── config/          # Database and environment config
├── routes/          # API route definitions
├── controllers/     # Route handler logic
├── middleware/      # Express middleware
├── models/          # Database models
├── utils/           # Utility functions
└── index.js         # Application entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP to email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `POST /api/auth/logout` - Logout

### Projects
- `GET /api/projects` - List all projects
- `POST /api/projects` - Create a project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### Tasks
- `GET /api/projects/:projectId/tasks` - List tasks in a project
- `POST /api/projects/:projectId/tasks` - Create a task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Environment Variables

See `.env.example` for required configuration.

## Database Schema

The application uses PostgreSQL with the following main tables:
- `users` - User accounts
- `projects` - Project information
- `tasks` - Task information
- `otp_logs` - OTP verification logs
