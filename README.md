# TODO Application

A full-stack TODO application with advanced features including categories, tags, due dates, and priority levels.

## Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Organize tasks with categories
- ✅ Add multiple tags to tasks
- ✅ Set due dates with overdue indicators
- ✅ Assign priority levels (High, Medium, Low)
- ✅ Filter tasks by status, priority, category, and tags
- ✅ Sort tasks by creation date, due date, or priority
- ✅ Responsive design for mobile and desktop
- ✅ Real-time updates

## Technology Stack

### Backend
- Node.js + Express.js + TypeScript
- SQLite database with Sequelize ORM
- RESTful API architecture
- Input validation with express-validator

### Frontend
- React + TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Axios for API calls
- Context API for state management
- date-fns for date handling
- lucide-react for icons

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd todo
```

2. Install dependencies:
```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

## Development

### Run both frontend and backend concurrently:
```bash
npm run dev
```

### Run backend only:
```bash
npm run backend
```

### Run frontend only:
```bash
npm run frontend
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API**: http://localhost:3000/api

## API Endpoints

### Tasks
- `GET /api/tasks` - Get all tasks (supports filtering and sorting)
  - Query params: `completed`, `priority`, `categoryId`, `tag`, `sortBy`, `order`
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `PATCH /api/tasks/:id/complete` - Toggle task completion
- `DELETE /api/tasks/:id` - Delete task

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## Project Structure

```
todo/
├── backend/                 # Backend application
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middleware/     # Express middleware
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── types/          # TypeScript types
│   │   └── server.ts       # Application entry point
│   └── database/           # SQLite database files
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React Context
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   ├── utils/          # Utility functions
│   │   └── App.tsx         # Main app component
│   └── public/             # Static assets
└── package.json            # Root package configuration
```

## Building for Production

### Build backend:
```bash
cd backend && npm run build
```

### Build frontend:
```bash
cd frontend && npm run build
```

### Build both:
```bash
npm run build
```

## Environment Variables

Backend `.env` file:
```
PORT=3000
NODE_ENV=development
DATABASE_PATH=./database/todo.db
```

## License

MIT

## Author

Created with Claude Code
